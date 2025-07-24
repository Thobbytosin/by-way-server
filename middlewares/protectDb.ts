import { NextFunction, Request, Response } from "express";
import catchAsyncError from "./catchAsyncErrors";
import dotenv from "dotenv";

dotenv.config();

export const protectDB = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    if (
      process.env.NODE_ENV === "production" &&
      req.headers["x-swagger-mock"]
    ) {
      return res.status(200).json({
        success: true,
        message:
          "This is a demo response. Connect your own database to test full functionality.",
        statusCode: 200,
      });
    }

    next();
  }
);
