import dotenv from "dotenv";
// import { redis } from "./redis";
import { IUser } from "../models/user.model";
import { Response } from "express";

dotenv.config();

interface ITokenOptions {
  maxAge: number;
  httpOnly: boolean;
  sameSite: "none" | "lax" | "strict";
  secure?: boolean;
  domain?: string;
}

const accessTokenExpire = Number(process.env.ACCESS_TOKEN_EXPIRE) || 59;

const refreshTokenExpire = Number(process.env.REFRESH_TOKEN_EXPIRE) || 7;

const isProduction = process.env.NODE_ENV === "production";

//   options for cookies
export const accessTokenOptions: ITokenOptions = {
  maxAge: accessTokenExpire * 60 * 1000, // expires in minutes
  httpOnly: true,
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
};

export const refreshTokenOptions: ITokenOptions = {
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000, // expires in days
  httpOnly: true,
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction, // for production
};

export const hasLoggedInTokenOptions: ITokenOptions = {
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000, // days
  httpOnly: false, // client accessible
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
};

export const activationTokenOptions: ITokenOptions = {
  maxAge: 4 * 60 * 1000, // 4 miuntes
  httpOnly: true,
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
};

export const sendToken = async (
  user: IUser,
  statusCode: number,
  res: Response
) => {
  // login with access and refresh token
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();
  const loggedInToken = process.env.LOGGED_IN_TOKEN;

  // accessToken expires in
  const accessTokenExpiresAt = new Date(
    Date.now() + accessTokenOptions.maxAge
  ).getTime();

  // save the tokens in the cookie
  // res.cookie("access_Token", accessToken, accessTokenOptions);
  // res.cookie("refresh_Token", refreshToken, refreshTokenOptions);
  // res.cookie("_can_logged_t", loggedInToken, hasLoggedInTokenOptions);

  // res.setHeader("x-access-token", accessToken);
  // res.setHeader("x-refresh-token", refreshToken);

  res.apiSuccess(
    {
      user,
      expiresAt: accessTokenExpiresAt,
      accessToken,
      refreshToken,
      loggedInToken,
    },
    "Logged in successfully",
    statusCode
  );
  // res.status(statusCode).json({
  //   success: true,
  //   user,
  //   expiresAt: accessTokenExpiresAt,
  // });
};
