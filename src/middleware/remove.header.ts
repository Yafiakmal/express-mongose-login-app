import "dotenv/config";
import { Request, Response, NextFunction } from "express";
import { header, validationResult } from "express-validator";
import jwt from "jsonwebtoken";

import { errorResponse } from "../types/http_response.js";
import { error } from "../label/error_label.js";

export const headerSchema = [
  header("authorization")
    .notEmpty()
    .withMessage("Authorization header is required"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new Error("Authorization header is required"));
    }

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // ambil token setelah 'Bearer'

    if (!token) {
      return res.status(401).json(errorResponse(401,error.TOKEN_NOT_PROVIDED_0, 'please provide token'));
    }

    try {
      if (!process.env.JWT_AT_SECRET) {
        return next(new jwt.JsonWebTokenError("secret key not provided"));
      }
      const decoded = jwt.verify(token, process.env.JWT_AT_SECRET);
      // simpan payload kalau mau
      (req as any).decoded = decoded;
      next();
    } catch (err) {
      next(err);
    }
  },
];
