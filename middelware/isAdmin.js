import Unauthorized from "../errors/unauthorized.js";
import { StatusCodes } from "http-status-codes";

function isAdmin(req, res, next) {
  if (req.userType == "admin") {
    next();
  } else {
    return res
      .status(StatusCodes.METHOD_NOT_ALLOWED)
      .json({ message: "not allowed" });
  }
}

export default isAdmin;
