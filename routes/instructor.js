import express from "express";

const router = express.Router();

// middleware
import { isAdmin, requireSignin } from "../middlewares";

// controllers
import {
 uploadImage,
 removeImage,
 deleteInstructor,
 makeInstructor,
 read,
 update,
//  getAccountStatus,
 currentInstructor,
 instructorCourses,
 findInstructor,
} from "../controllers/instructor";

// image
router.post("/instructor/upload-image", uploadImage);
router.post("/instructor/remove-image", removeImage);

router.post('/make-instructor', requireSignin, isAdmin, makeInstructor)
// router.post('/get-account-status', requireSignin, getAccountStatus)
router.get('/current-instructor', requireSignin, currentInstructor)

router.get("/instructor-courses", requireSignin, instructorCourses);
router.get("/find-instructor", requireSignin, findInstructor)
router.get('/instructor/:slug', read)
router.put('/instructor/:slug', requireSignin, update)
router.delete('/instructor/delete/:slug', deleteInstructor)

module.exports = router;
