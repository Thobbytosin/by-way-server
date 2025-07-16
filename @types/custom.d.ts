import { Request, Response } from "express";
import { IUser } from "../models/user.model";
import { File } from "formidable";
import ErrorHandler from "../utils/errorHandler";

declare global {
  namespace Express {
    interface Request {
      user: IUser;
      tokens: {
        accessToken: string;
        refreshToken: string;
        loggedInToken: string;
      };
      files: { [key: string]: File | File[] };
    }

    interface Response {
      apiSuccess<T = any>(data: T, message?: string, statusCode?: number): void;

      apiError(error: ErrorHandler): void;
    }
  }
}
