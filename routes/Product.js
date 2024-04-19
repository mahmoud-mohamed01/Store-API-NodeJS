import express from "express";
import Product from "../models/Product.js";
import mongoose from "mongoose";
import fs from "fs";
import { body, validationResult } from "express-validator";
import isAuth from "../middelware/isAuth.js";
import isAdmin from "../middelware/isAdmin.js";
import asyncHandler from "express-async-handler";
import {
  AddProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProductById,
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post(
  "/",
  isAuth,
  isAdmin,
  body(["name", "price", "category"]).notEmpty(),
  AddProduct
);
productRouter.put("/:id", isAuth, isAdmin, updateProductById);
productRouter.delete("/:id", isAuth, isAdmin, deleteProduct);

productRouter.get("/", getAllProducts);
productRouter.get("/:id", asyncHandler(getProductById));

export default productRouter;
