import {
  BadRequestError,
  NotFound,
  Unauthorized,
  NotAvialable,
} from "../errors/index.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { StatusCodes } from "http-status-codes";

async function addOrder(req, res) {
  const { cartItems, tax, shippingFee } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw new BadRequestError("No cart items provided");
  }
  if (!tax || !shippingFee) {
    throw new BadRequestError("Please provide tax and shipping fee");
  }

  let orderItems = [];
  let ProductsList = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const product = await Product.findOne({ _id: item.product });
    if (!product) {
      throw new NotFound("no product found with this id:" + item.Product);
    } else if (product.inventory <= 0) {
      throw new NotAvialable("the product is not avialable");
    }

    ProductsList.push({ product, amount: item.amount });

    const { name, price, image, _id } = product;
    const singleOrderItem = {
      amount: item.amount,
      name,
      price,
      image,
      product: _id,
    };

    //adding the item
    orderItems = [...orderItems, singleOrderItem];
    subtotal = parseInt(item.amount) * price;
  }

  //calculate total
  const total = tax + shippingFee + subtotal;
  const order = new Order({
    orderItems,
    shippingFee,
    subtotal,
    tax,
    total,
    user: req.userId,
  });
  await order.save();

  //update inventory
  ProductsList.forEach(async (item) => {
    item.product.inventory -= item.amount;
    await item.product.save();
  });

  return res
    .status(StatusCodes.CREATED)
    .json({ message: "order created", order: order });
}

async function getAllOrders(req, res) {
  let orders = await Order.find();
  return res.status(StatusCodes.OK).json({ orders: orders });
}

async function getUserOrders(req, res) {
  let userOrders = await Order.find({ user: req.userId });
  return res.status(StatusCodes.OK).json({ orders: userOrders });
}

async function getUserOrderById(req, res) {
  let order = await Order.findById(req.params);
  if (!order) {
    throw new NotFound("no order with this id :" + req.params);
  }

  if (order.user != req.userId) {
    throw new Unauthorized("user has no order with this id");
  }

  return res.status(StatusCodes.OK).json({ order: order });
}

export { addOrder, getAllOrders, getUserOrderById, getUserOrders };
