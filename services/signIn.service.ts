import {
  accessTokenExpire,
  accessTokenOptions,
  hasLoggedInTokenOptions,
  refreshTokenExpire,
  refreshTokenOptions,
} from "../utils/jwt";
import { Response } from "express";
import jwt from "jsonwebtoken";

export type TUser = {
  _id: string;
  name: string;
  email: string;
  avatar: {
    id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: { courseId: string }[];
};

export const sendToken = async (
  user: TUser,
  statusCode: number,
  res: Response
) => {
  // generate unique access token when user logs in
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.ACCESS_TOKEN_SIGN_IN as string,
    { expiresIn: `${accessTokenExpire as any}m` }
  );

  // generate unique refresh token when user logs in
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SIGN_IN as string,
    { expiresIn: `${refreshTokenExpire as any}d` }
  );

  const loggedInToken = process.env.LOGGED_IN_TOKEN;

  // accessToken expires in
  const accessTokenExpiresAt = new Date(
    Date.now() + accessTokenOptions.maxAge
  ).getTime();

  // save the tokens in the cookie
  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);
  res.cookie("_can_logged_in", loggedInToken, hasLoggedInTokenOptions);

  res.apiSuccess(
    {
      user,
      expiresAt: accessTokenExpiresAt,
    },
    "Logged in successfully",
    statusCode
  );
};
