import express from "express";
import jwt from "jsonwebtoken";
import { error } from "../label/error_label.js";
import { z } from "zod";
import { fromError } from 'zod-validation-error';
import { errorResponse } from "../types/http_response.js";
import { HttpError } from "../error/HttpError.js";
import logger from "../utils/logger.js";

export default (
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (err instanceof HttpError) {
    logger.warn("HttpError", {
      path: req.path,
      method: req.method,
    });

    return res
      .status(err.status)
      .json(
        errorResponse(err.status, err.label, err.message, err.details)
      );
  }
  if (err instanceof z.ZodError) {
    logger.warn("Zod validation error", {
      errors: err.errors,
      path: req.path,
      method: req.method,
    });

    return res
      .status(401)
      .json(
        errorResponse(401, error.INPUT_INVALID_1, fromError(err).toString() , err.errors)
      );
  }
  if (err instanceof jwt.JsonWebTokenError) {
    logger.error("Jsonwebtoken error", {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
    if(err instanceof jwt.TokenExpiredError){
      return res
      .status(401)
      .json(
        errorResponse(
          401,
          error.TOKEN_EXPIRED_0,
          "Your provided token are expired"
        )
      );
    }
    return res
      .status(401)
      .json(
        errorResponse(
          401,
          error.TOKEN_INVALID_0,
          "Your provided token are invalid"
        )
      );
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
      .json(errorResponse(500, error.INTERNAL_SERVER, err.message));
  }
};
