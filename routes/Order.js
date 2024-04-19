import express from "express";
import { BadRequestError, NotFound, Unauthorized } from "../errors/index.js";
import asyncHandler from "express-async-handler";
import isAuth from "../middelware/isAuth.js";
import isAdmin from "../middelware/isAdmin.js";
import {
  addOrder,
  getAllOrders,
  getUserOrderById,
  getUserOrders,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.post("/", isAuth, asyncHandler(addOrder));
orderRouter.get("/", isAuth, isAdmin, asyncHandler(getAllOrders));
orderRouter.get("/myOrders", isAuth, asyncHandler(getUserOrders));
orderRouter.get("/:id", isAuth, asyncHandler(getUserOrderById));

export default orderRouter;
