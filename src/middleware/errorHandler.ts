import express from "express";
import jwt from "jsonwebtoken";
import { error } from "../label/error_label.js";
import { z } from "zod";
import { errorResponse } from "../types/http_response.js";
import logger from "../utils/logger.js";

export default (
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  
  if (err instanceof z.ZodError) {
    logger.warn("Zod validation error", { errors: err.errors, path: req.path, method: req.method });

    return res
      .status(400)
      .json(errorResponse(error.ZOD_VALIDATION, "validation error", err.errors));
  }
  if(err instanceof jwt.JsonWebTokenError){
    logger.error("Jsonwebtoken error", {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
    return res.status(400).json(errorResponse(error.INVALID_TOKEN_FORMAT, 'Please Check Your Token', [err.message]))
  }
  if (err instanceof Error) {
    logger.error("Internal server error", {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
    return res
      .status(500)
      .json(errorResponse(error.INTERNAL_SERVER, error.INTERNAL_SERVER));
  }

  logger.error("Unknown error type", {
    err,
    path: req.path,
    method: req.method,
  });

  res
    .status(500)
    .json(errorResponse(error.UNKNOWN_TYPE_ERROR, error.UNKNOWN_TYPE_ERROR));
};
