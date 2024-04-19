import express from "express";
import asyncHandler from "express-async-handler";

import { body } from "express-validator";
import isAdmin from "../middelware/isAdmin.js";
import isAuth from "../middelware/isAuth.js";
import {
  forgetPassword,
  getUsers,
  getUserByID,
  login,
  register,
  resetPassword,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", asyncHandler(register));
userRouter.post(
  "/login",
  body(["password", "email"], "password and email must provided").notEmpty(),
  asyncHandler(login)
);
userRouter.get("/", isAuth, isAdmin, asyncHandler(getUsers));
userRouter.get("/:id", isAuth, asyncHandler(getUserByID));
userRouter.post("/forgetPassword", asyncHandler(forgetPassword));
userRouter.patch("/resetPassword/:resetToken", asyncHandler(resetPassword));

export default userRouter;
