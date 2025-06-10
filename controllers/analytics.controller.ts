import { Request, Response } from "express";
import catchAsyncError from "../middlewares/catchAsyncErrors";
import ErrorHandler from "../utils/errorHandler";
import { generateLast12MonthsData } from "../utils/analytics.generator";
import User from "../models/user.model";
import Course from "../models/course.model";
import Order from "../models/order.model";

// get user analytics
export const getUserAnalytics = catchAsyncError(
  async (req: Request, res: Response, next: NewableFunction) => {
    const users = await generateLast12MonthsData(User);

    res.apiSuccess(users);
  }
);

// get courses analytics
export const getCourseAnalytics = catchAsyncError(
  async (req: Request, res: Response, next: NewableFunction) => {
    const courses = await generateLast12MonthsData(Course);

    res.apiSuccess(courses);
  }
);

// get orders analytics
export const getOrderAnalytics = catchAsyncError(
  async (req: Request, res: Response, next: NewableFunction) => {
    const orders = await generateLast12MonthsData(Order);

    res.apiSuccess(orders);
  }
);
