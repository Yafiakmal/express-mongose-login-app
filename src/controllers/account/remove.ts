import express from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";

import {
  comparePassByEmail,
  getUserByEmail,
  deleteUser
} from "../../services/db_user.js";
import { error } from "../../label/error_label.js";
import { errorResponse, successResponse } from "../../types/http_response.js";
import logger from "../../utils/logger.js";
import { removeUserRefreshToken } from "../../services/db_refreshtoken.js";
import { HttpError } from "../../error/HttpError.js";

export default async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { password } = req.body;
    logger.info(`${req.method} ${req.path}`);
    logger.debug(`${req.method} ${req.path}`, {
      body: req.body,
      header: req.headers,
    });
    const decoded = (req as any).decoded as jwt.JwtPayload;
    if (decoded) {
        const user = await deleteUser(decoded.username, password)
        await removeUserRefreshToken(user?.id)
        return res.status(200).json(successResponse(200, 'user deleted successfully', [{username:user?.username}]))
    }
    next(new jwt.JsonWebTokenError('Credential Not Provided'));
  } catch (err) {
    next(err);
  }
};
