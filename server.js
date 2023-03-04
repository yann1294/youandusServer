import express from "express";
import cors from "cors";
import { readdirSync } from "fs";
import mongoose from "mongoose";
import csrf from "csurf";
import cookieParser from "cookie-parser";
const morgan = require("morgan");
require("dotenv").config();

const csrfProtection = csrf({ cookie: true });
const crypto = require('crypto')
const session = require('express-session')

// create express app
const app = express();

// db
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("**DB CONNECTED**"))
  .catch((err) => console.log("DB CONNECTION ERR => ", err));


// apply middlewares
app.use(cors({
  credentials: true,
  origin: 'https://youandusclient.vercel.app'
}));
app.use(express.json({limit: '5mb'}));
app.use(cookieParser());
app.use(morgan("dev"));

// route
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

// csrf
app.use(csrfProtection);

app.get("/api/csrf-token", (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://youandusclient.vercel.app');
  res.header('Access-Control-Expose-Headers', 'X-CSRF-Token');
  res.json({ csrfToken: req.csrfToken() });
});

// error handler
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'Unauthorized' });
  } else if (err.name === 'ValidationError') {
    res.status(422).json({ error: err.message });
  } else {
    res.status(500).json({ error: err.message });
  }
});

// port
const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
