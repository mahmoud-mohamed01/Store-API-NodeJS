import User from "../models/User.js";
import { BadRequestError, NotFound, Unauthorized } from "../errors/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import nodemailer from "nodemailer";
import crypto from "crypto";

//email configration
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mahmoudtestacc0@gmail.com",
    pass: "hxyn jstk mdpr enrd",
  },
});

//register user
async function register(req, res) {
  let { email, firstName, lastName, password, type } = req.body;
  let existUser = await User.findOne({ email: email });
  if (existUser) {
    throw new BadRequestError("user already exist");
  }

  let hashedPassword = await bcrypt.hash(password, 10);
  let newUser;

  if (type == "admin") {
    newUser = new User({
      email,
      firstName,
      lastName,
      passwrod: hashedPassword,
      type: type,
    });
  } else {
    newUser = new User({
      email,
      firstName,
      lastName,
      passwrod: hashedPassword,
    });
  }

  await newUser.save();
  return res
    .status(StatusCodes.CREATED)
    .json({ message: "user created", newUser });
}

//user login
async function login(req, res) {
  let validtionErrors = validationResult(req);
  if (!validtionErrors.isEmpty()) {
    return res.status(422).json({ message: validtionErrors.array()[0] });
  }

  let { email, password } = req.body;
  let existUser = await User.findOne({ email: email });

  if (!existUser) {
    throw new NotFound("user not found");
  }

  let correctPassword = await bcrypt.compare(password, existUser.passwrod);
  if (!correctPassword) {
    throw new BadRequestError("password not correct");
  }

  let token = jwt.sign(
    {
      email: existUser.email,
      userId: existUser._id.toString(),
      type: existUser.type,
    },
    "supersecret",
    { expiresIn: "1h" }
  );
  return res
    .status(StatusCodes.OK)
    .json({ token: token, userId: existUser._id.toString() });
}

//get user By id

async function getUserByID(req, res) {
  let { id } = req.params;
  let user = await User.findById(id);
  if (!user) {
    throw new NotFound("user not found with this id: " + id);
  }
  return res.status(StatusCodes.OK).json({ user: user });
}

//getting All users data
async function getUsers(req, res) {
  let users = await User.find();
  return res.status(StatusCodes.OK).json(users);
}
//forget pasword and sending the token to reset the password
async function forgetPassword(req, res) {
  let { email } = req.body;

  let user = await User.findOne({ email: email });
  if (!user) {
    throw new NotFound("user not found");
  }

  //generate random reset token
  let resetToken = user.createResetPasswordToken();
  await user.save();

  const restetUrl = `${req.protocol}://${req.get(
    "host"
  )}/user/resetPassword/${resetToken}`;
  const message = `we have recived a password reset request, please use the below link \n ${restetUrl}`;

  //send the token back to the user email
  let mailOptions = {
    from: "mahmoud@gmail.com",
    to: email,
    subject: "forget your password",
    text: message,
  };

  await transporter.sendMail(mailOptions, async function (error, info) {
    if (error) {
      console.log(error);
      user.passwordResetToken = undefined;
      user.passwrodResetTokenExpires = undefined;
      await user.save();
      return res
        .status(400)
        .json({ message: "something went wrong try again" });
    } else {
      console.log("Email sent: " + info.response);
    }
  });

  return res.status(200).json(resetToken);
}

async function resetPassword(req, res) {
  let { password } = req.body;
  //encrypt the plain hex token
  const token = crypto
    .createHash("md5")
    .update(req.params.resetToken)
    .digest("hex");

  //check if the user exist with valid token and token hasn't expired
  let user = await User.findOne({
    passwordResetToken: token,
    passwrodResetTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new BadRequestError("token is expired or invalid");
  }

  let hashedPassword = await bcrypt.hash(password, 10);

  user.passwrod = hashedPassword;
  user.passwordResetToken = undefined;
  user.passwrodResetTokenExpires = undefined;

  await user.save();

  res.status(200).json({ message: "password updated" });
}

export {
  register,
  login,
  forgetPassword,
  getUserByID,
  getUsers,
  resetPassword,
};
