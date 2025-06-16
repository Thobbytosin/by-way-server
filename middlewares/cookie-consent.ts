import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/errorHandler";
import catchAsyncError from "./catchAsyncErrors";

export interface CookieConsentType {
  accept: boolean;
}

export const checkCookieConsent = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    // skip api docs
    if (req.path.startsWith("/api/v1/api-docs")) {
      return next();
    }

    const rawConsent = req.headers["x-cookie-consent"];

    if (!rawConsent)
      return next(
        new ErrorHandler("Cookie consent is required to proceed", 404)
      );

    const consentHeader = Array.isArray(rawConsent)
      ? rawConsent[0]
      : rawConsent;

    let consent = {} as CookieConsentType;

    try {
      consent = JSON.parse(consentHeader);
    } catch (error) {
      return next(new ErrorHandler("Invalid cookie consent format", 400));
    }

    next();
  }
);
