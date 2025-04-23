import { error } from "../label/error_label.js";
export interface ErrorResponse<T = any[]> {
  status: "error";
  label: error;
  message: string;
  details?: T;
}

export interface SuccessResponse<T = any[]> {
  status: "success";
  message: string;
  data?: T;
}

export function errorResponse<Details>(label: error, msg: string, details?: any[]): ErrorResponse {
  return {
    status: "error",
    label: label,
    message: msg,
    details: details
  };
}

export function successResponse<T>(msg: string, data?: T): SuccessResponse<T> {
  return {
    status: "success",
    message: msg,
    data: data,
  };
}
