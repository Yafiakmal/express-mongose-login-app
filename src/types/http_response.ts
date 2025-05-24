import { error } from "../label/error_label";
export interface ErrorResponse {
  status: number;
  label: error;
  message: string;
  details?: any[];
}

export interface SuccessResponse {
  status: number;
  message: string;
  data?: any[];
}

export function errorResponse(status: number,label: error, msg: string, details?: any[] ): ErrorResponse{
  return {
    status,
    label,
    message: msg,
    details
  };
}

export function successResponse(status: number, msg: string, data?: any[]): SuccessResponse {
  return {
    status,
    message: msg,
    data,
  };
}
