import express from "express";
import { isAdmin, isAuth } from "../middleware/Authorization.js";
import {
  adminGetAllOrdersController,
  changeOrderStatusController,
  createOderController,
  getAllOrdersController,
  getSingleOrderController,
  getUserPaymentController,
} from "../controllers/orderController.js";

const router = express.Router();

// create order
router.post("/create", isAuth, createOderController);

// Get all orders
router.get("/get-all", isAuth, getAllOrdersController);

// Get single order
router.get("/get-single/:id", isAuth, getSingleOrderController);

//  Get user payment
router.post("/get-user-payment", isAuth, getUserPaymentController);

// Admin routes can be added here
router.post(
  "/admin/get-all-orders",
  isAuth,
  isAdmin,
  adminGetAllOrdersController,
);

// change order status
router.put(
  "/admin/change-order-status/:id",
  isAuth,
  isAdmin,
  changeOrderStatusController,
);

export default router;
