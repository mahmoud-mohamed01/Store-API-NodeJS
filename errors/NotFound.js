import { StatusCodes } from "http-status-codes";
import CustomApiError from "./CustomApiError.js";

class NotFound extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NotFound;
  }
}

export default NotFound;
