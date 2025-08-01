import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import catchAsyncError from "./catchAsyncErrors";
import {
  accessTokenExpire,
  accessTokenOptions,
  hasLoggedInTokenOptions,
  refreshTokenExpire,
  refreshTokenOptions,
} from "../utils/jwt";
import ErrorHandler from "../utils/errorHandler";
import User, { IUser } from "../models/user.model";

dotenv.config();

export const updateTokens = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // fetch the refrsh token from the request cookies
    const { refresh_token } = req.cookies;
    // if there is no refresh token
    if (!refresh_token)
      return next(new ErrorHandler("Token is required.", 400));

    // verify if token is valid
    const decode = jwt.verify(
      refresh_token,
      process.env.REFRESH_TOKEN_SIGN_IN as string
    ) as { id: string };

    const user = await User.findById(decode.id);

    if (!user) return next(new ErrorHandler("Account not found", 404));

    // generate new access and refresh tokens
    const accessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN_SIGN_IN as string,
      { expiresIn: `${accessTokenExpire as any}m` }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SIGN_IN as string,
      { expiresIn: `${refreshTokenExpire as any}d` }
    );

    req.user = user;

    const loggedInToken = process.env.LOGGED_IN_TOKEN;

    //   save tokens in the response cookie

    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);
    res.cookie("_can_logged_in", loggedInToken, hasLoggedInTokenOptions);

    // res.setHeader("x-access-token", accessToken);
    // res.setHeader("x-refresh-token", refreshToken);

    // req.tokens = { accessToken, loggedInToken, refreshToken };
    req.user = user;
    next();
  }
);
