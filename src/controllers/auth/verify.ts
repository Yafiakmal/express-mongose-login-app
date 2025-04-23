import express from "express";
import { createUser, getAllUsers } from "../../services/db_user.js";
import { error } from "../../label/error_label.js";
import {
  errorResponse,
  successResponse,
} from "../../types/http_response.js";

export default async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
    console.log("/verify")
    res.json(successResponse("Verify Aman"));
}