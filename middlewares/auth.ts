import { NextFunction, Request, Response } from "express";
import catchAsyncError from "./catchAsyncErrors";
import ErrorHandler from "../utils/errorHandler";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model";

dotenv.config();

export const isUserAuthenticated = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // check if user is logged in (check and verify access token)

    const { access_Token } = req.cookies;

    // if there is no access token
    if (!access_Token)
      return next(
        new ErrorHandler("Unauthorized: Authentication required.", 401)
      );

    // verify access token
    const decodeAccess: any = jwt.verify(
      access_Token,
      (process.env.ACCESS_TOKEN_SIGN_IN as string) || ""
    );

    if (!decodeAccess)
      return next(
        new ErrorHandler("Unauthorized: Invalid authentication token", 401)
      );

    const user = await User.findById(decodeAccess.id);

    if (!user)
      return next(new ErrorHandler("Please login to access this", 404));

    req.user = user;

    return next();
  }
);

// authorize user role
export const authorizeRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role: ${req.user?.role} is restricted to access this`,
          403
        )
      );
    }
    next();
  };
};
