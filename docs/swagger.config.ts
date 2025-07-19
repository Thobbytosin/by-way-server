import paths from "../docs";
import dotenv from "dotenv";
import {
  userSignup,
  accountVerfification,
  errorResponse,
  successResponse,
  userSignin,
  userSocialSignin,
  updateUserProfile,
  updateUserPassword,
} from "./schemas";
import {
  cookieAuth,
  cookieRefresh,
  cookieVerification,
} from "./cookies-schema";
import { internalServerError } from "./responses";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const swaggerConfig = {
  openapi: "3.0.0",
  info: {
    title: "ByWay E-Learning API",
    version: "1.0.0",
    description:
      "API for an online e-learning platform where people can have access to resources for learning.",
    contact: {
      name: "ByWay Team",
      email: "support@byway.com",
      url: process.env.FRONTEND_ORIGIN,
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: isProduction
        ? process.env.PRODUCTION_SERVER_URL
        : process.env.LOCAL_SERVER_URL,
      description: isProduction
        ? "Version 1.0 Production Server"
        : "Version 1.0 Development Server",
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: cookieAuth,
      cookieRefresh: cookieRefresh,
      cookieVerification: cookieVerification,
    },
    schemas: {
      SuccessResponse: successResponse,
      ErrorResponse: errorResponse,
      UserSignup: userSignup,
      UserSignin: userSignin,
      UserSignSocialin: userSocialSignin,
      UpdateUserProfile: updateUserProfile,
      UpdateUserPassword: updateUserPassword,
      AccountVerfification: accountVerfification,
    },
    responses: {
      InternalServerError: internalServerError,
    },
  },
  paths,
};

export default swaggerConfig;
