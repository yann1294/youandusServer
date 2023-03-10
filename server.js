import express from "express";
import cors from "cors";
import { readdirSync } from "fs";
import mongoose from "mongoose";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import session from "express-session";
import crypto from 'crypto';
const morgan = require("morgan");
require("dotenv").config();

// create express app
const app = express();

// add express-session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    sameSite: 'lax'
  }
}));

// csrf
const csrfProtection = csrf({ cookie: false, session: app.locals.session });
app.use(csrfProtection);

// apply middlewares
app.use(cors({
  
  origin: 'https://trial-umber.vercel.app',
  credentials: true
}));
app.use(express.json({limit: '5mb'}));
app.use(cookieParser());
app.use(morgan("dev"));

app.use((req, res, next) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(16).toString('hex');
  }
  res.locals.csrfToken = req.session.csrfToken;
  next();
});

// route
readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

app.get("/api/csrf-token", (req, res) => {
  res.header('Access-Control-Allow-Origin', 'https://trial-umber.vercel.app');
  res.header('Access-Control-Expose-Headers', 'X-CSRF-Token');
  res.json({ csrfToken: req.session.csrfToken });
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
