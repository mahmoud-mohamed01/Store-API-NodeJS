import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import productRouter from "./routes/Product.js";
import userRouter from "./routes/User.js";
import errorHandlerMiddleware from "./middelware/errorHandler.js";
import orderRouter from "./routes/Order.js";
const app = express();
const port = 3000;

//middelwares
app.use(express.json());
app.use(cors());
app.use("/images", express.static("./upload/images"));
// handel image upload to local storage
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

//app routes
app.use(multer({ storage: storage }).single("productImage"));
app.use("/products", productRouter);
app.use("/users", userRouter);
app.use("/orders", orderRouter);
app.use("*", (req, res) => {
  return res.status(404).json({ message: "route not exist" });
});
app.use(errorHandlerMiddleware);

app.listen(port, async () => {
  //DataBase conncection with MongoDB
  await mongoose.connect(
    "mongodb+srv://admin-mahmoud:mahmoud123@cluster0.rkskfqb.mongodb.net/e-commerce"
  );
  console.log("server started");
});
