import { StatusCodes } from "http-status-codes";
import CustomApiError from "./CustomApiError.js";

class NotAvialable extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.GONE;
  }
}

export default NotAvialable;
