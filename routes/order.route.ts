import { Router } from "express";
import { authorizeRoles, isUserAuthenticated } from "../middlewares/auth";
import {
  createOrder,
  getAllOrders,
  newPayment,
  sendStripePublishableKey,
} from "../controllers/order.controller";

const orderRouter = Router();

orderRouter.post("/create-order", isUserAuthenticated, createOrder);

orderRouter.get(
  "/get-all-orders",
  isUserAuthenticated,
  authorizeRoles("admin"),
  getAllOrders
);

orderRouter.get("/payment/stripepublishablekey", sendStripePublishableKey);

orderRouter.post("/payment", isUserAuthenticated, newPayment);

export default orderRouter;
