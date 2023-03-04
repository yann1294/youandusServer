import express from "express";

const router = express.Router();

// middleware
import { requireSignin } from "../middlewares";

// controllers
import {
    register,
    currentAdmin,
} from "../controllers/admin"

router.post("/register-admin", register);
router.get('/current-admin', requireSignin, currentAdmin)

module.exports = router;