import { error } from "../label/error_label.js";
import { ErrorResponse } from "../types/http_response.js";

export class HttpError extends Error implements ErrorResponse {
  label: error;
  details?: any[];
  status: number;
  constructor(status: number, label: error, msg: string, details?: any[]) {
    super(msg);
    this.label = label;
    this.status = status;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
