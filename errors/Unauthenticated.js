import { StatusCodes } from "http-status-codes";
import CustomApiError from "./CustomApiError.js";

class Unauthenticated extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

export default Unauthenticated;
