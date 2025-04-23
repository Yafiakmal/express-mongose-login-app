import express from "express";
import { error } from "../label/error_label.js";
import { z } from "zod";
import { errorResponse } from "../types/http_response.js";

export default (
  err: Error,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (err instanceof z.ZodError) {
    return res
      .status(400)
      .json(errorResponse(error.NOT_LABELED, "error zod", err.errors));
  }

  if (err instanceof Error) {
    console.error("error:", err);
    return res.status(500).json(errorResponse(error.INTERNAL_SERVER, error.INTERNAL_SERVER));
  }

  console.error("Unknown error type:", err);
  res.status(500).json(errorResponse(error.UNKNOWN_TYPE_ERROR, error.UNKNOWN_TYPE_ERROR));
};
