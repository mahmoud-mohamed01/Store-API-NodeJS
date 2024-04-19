import mongoose from "mongoose";
import crypto from "crypto";

const Shcema = mongoose.Schema;

const userSchema = new Shcema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  passwrod: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "cutsmer",
  },
  passwordResetToken: String,
  passwrodResetTokenExpires: Date,
});

userSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("md5")
    .update(resetToken)
    .digest("hex");
  this.passwrodResetTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

export default mongoose.model("User", userSchema);
