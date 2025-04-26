import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { isRefreshTokenExist } from "../services/db_refreshtoken.js";
import { successResponse } from "../types/http_response.js";
import logger from "../utils/logger.js";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.debug(`validateRefreshToken()`);
    const token = req.cookies["refreshTokenRefresh"];
    if (token) {
      if (!process.env.JWT_RT_SECRET) {
        return next(new Error("environment variable not set"));
      }
      jwt.verify(token, process.env.JWT_RT_SECRET);
      if (await isRefreshTokenExist(token)) {
        return res.status(200).json(successResponse(`you have already login`));
      }
      return next(); // Lanjut ke controller jika valid
    }
    next();
  } catch (err) {
    next(err);
  }
};
