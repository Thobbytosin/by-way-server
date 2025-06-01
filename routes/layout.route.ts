import { Router } from "express";
import { authorizeRoles, isUserAuthenticated } from "../middlewares/auth";
import {
  createLayout,
  editLayout,
  getLayoutByType,
} from "../controllers/layout.controller";

const layoutRouter = Router();

layoutRouter.post(
  "/create-layout",
  isUserAuthenticated,
  authorizeRoles("admin"),
  createLayout
);

layoutRouter.put(
  "/edit-layout",
  isUserAuthenticated,
  authorizeRoles("admin"),
  editLayout
);

layoutRouter.get("/get-layout/:type", getLayoutByType);

export default layoutRouter;
