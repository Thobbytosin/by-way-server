import { Router } from "express";
import {
  getAllNotifications,
  updateNotificationStatus,
} from "../controllers/notification.controller";
import { authorizeRoles, isUserAuthenticated } from "../middlewares/auth";

const notificationRouter = Router();

notificationRouter.get(
  "/get-all-notifications",
  isUserAuthenticated,
  authorizeRoles("admin"),
  getAllNotifications
);

notificationRouter.put(
  "/update-notification-status/:id",
  isUserAuthenticated,
  authorizeRoles("admin"),
  updateNotificationStatus
);

export default notificationRouter;
