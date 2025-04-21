import { error } from "../label/error_label.js";
interface ErrorResponse {
  status: "error";
  label: error;
  message: string;
}

interface SuccessResponse<Data> {
  status: "success";
  message: string;
  data?: Data;
}

export function errorResponse(label: error, msg: string): ErrorResponse {
  return {
    status: "error",
    label: label,
    message: msg,
  };
}

export function successResponse<T>(msg: string, data?: T): SuccessResponse<T> {
  return {
    status: "success",
    message: msg,
    data: data,
  };
}
