import express from "express";

const router = express.Router();

// middleware
import { isAdmin, requireSignin } from "../middlewares";

// controllers

import {
   uploadImage,
   removeImage,
   update,
   deleteStudent,
   read,
   createStudent,
   findStudent,
} from "../controllers/student"

// image
router.post("/student/upload-image", uploadImage);
router.post("/student/remove-image", removeImage);

router.post('/student/create-student', requireSignin, isAdmin, createStudent)
router.get("/find-student", requireSignin, findStudent)
router.put('/student/:slug', requireSignin, update)
router.get('/student/:slug', read),
router.delete('/student/delete/:slug', deleteStudent)


module.exports = router;