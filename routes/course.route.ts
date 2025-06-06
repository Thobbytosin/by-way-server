import express from "express";
import { authorizeRoles, isUserAuthenticated } from "../middlewares/auth";
import {
  addAnswer,
  addQuestion,
  addReplyToReview,
  addReview,
  deleteCourse,
  editCourse,
  generateVideoUrl,
  getAdminAllCourses,
  getAllCourses,
  getCourseByUser,
  getSingleCourse,
  uploadCourse,
} from "../controllers/course.controller";
import { fileParser } from "../middlewares/fileParser";

const courseRouter = express.Router();

// create course (admin only)
courseRouter.post(
  "/create-course",
  isUserAuthenticated,
  authorizeRoles("admin"),
  fileParser,
  uploadCourse
);

// update course (admin)
courseRouter.put(
  "/edit-course/:course_id",
  isUserAuthenticated,
  authorizeRoles("admin"),
  editCourse
);

// get a course (logged in user)
courseRouter.get(
  "/get-course/:course_id",
  isUserAuthenticated,
  getSingleCourse
);

// get a course free
courseRouter.get("/get-course-free/:course_id", getSingleCourse);

// get all courses
courseRouter.get("/get-courses", getAllCourses);

// get course content (only paid users)
courseRouter.get(
  "/get-course-content/:course_id",
  isUserAuthenticated,
  getCourseByUser
);

// ask a question about course (only paid users)
courseRouter.put("/add-question", isUserAuthenticated, addQuestion);

// add answer to course question (only paid users)
courseRouter.put("/add-answer", isUserAuthenticated, addAnswer);

// add a review (only paid users)
courseRouter.put("/add-review/:course_id", isUserAuthenticated, addReview);

// reply to a review (only admin)
courseRouter.put(
  "/add-reply-review/:course_id",
  isUserAuthenticated,
  authorizeRoles("admin"),
  addReplyToReview
);

// get all courses (only admin)
courseRouter.get(
  "/get-all-courses",
  isUserAuthenticated,
  authorizeRoles("admin"),
  getAdminAllCourses
);

// delete a course (only admin)
courseRouter.delete(
  "/delete-course/:courseId",
  isUserAuthenticated,
  authorizeRoles("admin"),
  deleteCourse
);

// generate a course video url (only admin)
courseRouter.post("/generate-video-url", generateVideoUrl);

export default courseRouter;
