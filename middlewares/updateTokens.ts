import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import catchAsyncError from "./catchAsyncErrors";
import {
  accessTokenOptions,
  hasLoggedInTokenOptions,
  refreshTokenOptions,
} from "../utils/jwt";
import ErrorHandler from "../utils/errorHandler";
import User from "../models/user.model";

dotenv.config();

export const updateTokens = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // fetch the refrsh token from the request cookies
    const { refresh_Token } = req.cookies;

    // verify if token is valid
    const decode = jwt.verify(
      refresh_Token,
      process.env.REFRESH_TOKEN_SIGN_IN as string
    ) as { id: string };

    // NOTE: jwt will return an error if refresh_Token has expired. No need to check

    const userId = decode.id;

    const user = await User.findById(userId);

    if (!user)
      return next(new ErrorHandler("Please login to access this", 404));

    // generate a new access and refresh tokens
    const accessToken = jwt.sign(
      { id: userId },
      process.env.ACCESS_TOKEN_SIGN_IN as string,
      {
        expiresIn:
          `${Number(process.env.ACCESS_TOKEN_EXPIRE) as any}m` || "59m",
      }
    );

    const refreshToken = jwt.sign(
      { id: userId },
      process.env.REFRESH_TOKEN_SIGN_IN as string,
      {
        expiresIn:
          `${Number(process.env.REFRESH_TOKEN_EXPIRE) as any}d` || "7d",
      }
    );

    req.user = user;

    const loggedInToken = process.env.LOGGED_IN_TOKEN || "";

    //   save tokens in the response cookie

    // res.cookie("access_Token", accessToken, accessTokenOptions);
    // res.cookie("refresh_Token", refreshToken, refreshTokenOptions);
    // res.cookie("_can_logged_t", loggedInToken, hasLoggedInTokenOptions);
    req.tokens = { accessToken, loggedInToken, refreshToken };
    req.user = user;
    next();
  }
);
