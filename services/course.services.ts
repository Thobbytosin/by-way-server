import { NextFunction, Response } from "express";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import Course from "../models/course.model";
import ErrorHandler from "../utils/errorHandler";

// create course
export const createCourse = catchAsyncError(
  async (data: any, res: Response, next: NextFunction) => {
    await Course.create(data);

    res.apiSuccess(null, "Course created", 201);
  }
);

// get all courses
export const getAllCoursesService = async (res: Response) => {
  const courses = await Course.find().sort({ createdAt: -1 });

  res.apiSuccess(courses);
};
