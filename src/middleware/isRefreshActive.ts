import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { isRefreshTokenExist } from "../services/db_refreshtoken";
import { successResponse } from "../types/http_response";
import logger from "../utils/logger";
import { HttpError } from "../error/HttpError";
import { error } from "../label/error_label";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.debug(`validateRefreshToken()`);
    const token = req.cookies["refreshTokenRefresh"];
    if (token) {
      if (!process.env.JWT_RT_SECRET) {
        return next(new jwt.JsonWebTokenError("secret key not provided"));
      }
      jwt.verify(token, process.env.JWT_RT_SECRET);
      if (await isRefreshTokenExist(token)) {
        return res.status(200).json(successResponse(200, `you have already login`));
      }
      return next(); // Lanjut ke controller jika valid
    }
    next();
  } catch (err) {
    next(err);
  }
};
