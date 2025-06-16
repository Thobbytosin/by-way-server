import { NextFunction, Request, Response } from "express";
import catchAsyncError from "./catchAsyncErrors";
import ErrorHandler from "../utils/errorHandler";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User, { IUser } from "../models/user.model";

dotenv.config();

export const isUserAuthenticated = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // check if user is logged in (check and verify access token)
    const { access_token } = req.cookies;

    // if there is no access token
    if (!access_token)
      return next(
        new ErrorHandler("Restricted: Authentication required.", 400)
      );

    // verify access token
    const decodeAccess = jwt.verify(
      access_token,
      (process.env.ACCESS_TOKEN_SIGN_IN as string) || ""
    ) as { id: string };

    if (!decodeAccess.id)
      return next(new ErrorHandler("Session has ended. Please login.", 401));

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
