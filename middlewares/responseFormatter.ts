import { NextFunction, Request, Response } from "express";
import ApiResponse from "../utils/apiResponse";

const responseFormatter = (req: Request, res: Response, next: NextFunction) => {
  // intercepts the response
  res.apiSuccess = function (
    data,
    message = "Request success",
    statusCode = 200
  ) {
    this.status(statusCode).json(
      ApiResponse.success({ data, message, statusCode })
    );
  };

  res.apiError = function (error, statusCode = error.statusCode || 500) {
    this.status(statusCode).json(
      ApiResponse.error({ message: error.message, statusCode })
    );
  };

  next();
};

export default responseFormatter;
