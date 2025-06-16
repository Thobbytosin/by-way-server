import dotenv from "dotenv";
// import { redis } from "./redis";

dotenv.config();

interface ITokenOptions {
  maxAge: number;
  httpOnly: boolean;
  sameSite: "none" | "lax" | "strict";
  secure?: boolean;
  domain?: string;
}

export const accessTokenExpire = Number(process.env.ACCESS_TOKEN_EXPIRE) || 59;

export const refreshTokenExpire = Number(process.env.REFRESH_TOKEN_EXPIRE) || 7;

export const isProduction = process.env.NODE_ENV === "production";

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
