import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import ErrorMiddleware from "./middlewares/error";
import {
  activateUser,
  getUserInfo,
  loginUser,
  logoutUser,
  refreshTokens,
  registerUser,
  updateUserInfo,
} from "./controllers/user.controller";
import { checkCookieConsent } from "./middlewares/cookie-consent";
import mongoose from "mongoose";
import responseFormatter from "./middlewares/responseFormatter";
import { isUserAuthenticated } from "./middlewares/auth";
import { updateTokens } from "./middlewares/updateTokens";

export const createTestApp = () => {
  const appTest = express();

  appTest.use(express.json({ limit: "20mb" }));
  appTest.use(cors());
  appTest.use(cookieParser());

  appTest.get("/api/v1/health", (_, res) => {
    res.status(200).json({
      status: "OK",
    });
  });

  appTest.get("/api/v1/ui-health", (_, res) => {
    const dBReady = mongoose.connection.readyState === 1;

    if (dBReady) {
      console.log("✅✅ DB UP AND RUNNING ");
    } else {
      console.log("❌❌ DB DOWN");
    }

    if (!dBReady) {
      return res.status(503).json({
        success: false,
        message: "Database Network Error",
      });
    }

    res.status(200).json({ status: "OK" });
  });

  appTest.use(responseFormatter);

  appTest.use(checkCookieConsent);

  // ROUTES
  // AUTHS
  appTest.post("/api/v1/registration", registerUser);
  appTest.post("/api/v1/activate-user", activateUser);
  appTest.post("/api/v1/login", loginUser);
  appTest.post("/api/v1/logout", logoutUser);
  appTest.get("/api/v1/refresh-tokens", updateTokens, refreshTokens);

  // USERS
  appTest.get("/api/v1/me", isUserAuthenticated, getUserInfo);
  appTest.put("/api/v1/update-user-info", isUserAuthenticated, updateUserInfo);

  // unknown route
  appTest.all("*", (req, res, next) => {
    const error = new Error(`Route ${req.originalUrl} not found`) as any;
    error.statusCode = 400;
    next(error);
  });

  // MIDDLEWARES
  // handle errors middleware on all requests
  appTest.use(ErrorMiddleware);

  return appTest;
};
