import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import ErrorMiddleware from "./middlewares/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";
import mongoose from "mongoose";
import responseFormatter from "./middlewares/responseFormatter";
import { checkCookieConsent } from "./middlewares/cookie-consent";
import { limiter } from "./middlewares/rateLimit";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/swaggerDocument";
import { protectDB } from "./middlewares/protectDb";

export const app = express();
dotenv.config();

// limit for the json data / body parser
app.use(express.json({ limit: "50mb" }));

// cookie parser (sending cookies to frontend from server)
app.use(cookieParser());

// to send form data to server
app.use(express.urlencoded({ extended: false }));

const allowedOrigins = [
  process.env.NODE_ENV === "development" && "http://localhost:3000",
  "https://edu-learning-liard.vercel.app",
].filter(Boolean);

//CORS - cross-origin resource sharing
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);

// API DOCUMENTATION
app.use(
  "/api/v1/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      requestInterceptor: (req: any) => {
        req.credentials = "include";
        return req;
      },
    },
  })
);

app.get("/api/v1/health", (_, res) => {
  res.status(200).json({
    status: "OK",
  });
});

app.get("/api/v1/ui-health", (_, res) => {
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

app.use(protectDB); // protect main db from swagger

app.use(responseFormatter);

// Apply the rate limiting middleware to all requests.
app.use(limiter);

// check consent on all routes
app.use(checkCookieConsent);

// ROUTES
app.use("/api/v1", userRouter);
app.use("/api/v1", courseRouter);
app.use("/api/v1", orderRouter);
app.use("/api/v1", notificationRouter);
app.use("/api/v1", analyticsRouter);
app.use("/api/v1", layoutRouter);

// testing api
app.get("/test", (req, res, next) => {
  res.status(200).json({ message: "Api is up" });
});

// uknown route
app.all("*", (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 400;
  next(err);
});

// error middleware on all requests
app.use(ErrorMiddleware);

///////////////////////////////////////////////////////////////////
