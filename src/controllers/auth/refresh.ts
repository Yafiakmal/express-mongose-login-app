import "dotenv/config";
import express from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

import { getUserByEmail } from "../../services/db_user";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../services/token";
import {
  revokeRefreshToken,
  addRefreshToken,
  isRefreshTokenExist,
} from "../../services/db_refreshtoken";
import { setRefreshTokenCookie } from "../../utils/cookie";
import { error } from "../../label/error_label";
import { errorResponse, successResponse } from "../../types/http_response";
import logger from "../../utils/logger";
import { HttpError } from "../../error/HttpError";
import { ref } from "process";

export default async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  // cek cookie in request
  try {
    logger.info(`${req.method} ${req.path}`, {
      path: req.path,
      method: req.method,
      cookies: req.cookies,
    });
    const refreshToken = req.cookies["refreshTokenRefresh"];
    if (refreshToken) {
      if (!process.env.JWT_RT_SECRET) {
        return next(new Error("environment variable not set"));
      }
      jwt.verify(refreshToken, process.env.JWT_RT_SECRET);

      if (!(await isRefreshTokenExist(refreshToken))) {
        return next(
          new HttpError(
            400,
            error.TOKEN_NOT_PROVIDED_0,
            "please provide the refresh token"
          )
        );
      }
      const payload = jwt.decode(refreshToken) as jwt.JwtPayload;
      const user = await getUserByEmail(payload.email);
      delete payload.exp;
      delete payload.iat;
      const nATToken = await generateAccessToken(payload);
      const nRTToken = await generateRefreshToken(payload);

      await revokeRefreshToken(refreshToken);
      await addRefreshToken(user?._id as Types.ObjectId, nRTToken);
      setRefreshTokenCookie(
        res,
        "refreshTokenRefresh",
        nRTToken,
        "/api/auth/r",
        parseInt(
          process.env.JWT_RT_SECRET_EXPIN
            ? process.env.JWT_RT_SECRET_EXPIN
            : "604800"
        ) * 1000
      );
      return res.status(200).json(
        successResponse(200, "you have successfully refresh", [
          {
            accessToken: nATToken,
          },
        ])
      );
    }
    // throw new Error('refresh token not provided')
    return next(
      new HttpError(
        400,
        error.TOKEN_NOT_PROVIDED_0,
        "please provide the refresh token"
      )
    );
  } catch (error) {
    // logger.error(`${req.method} ${req.path}`,{error:error})
    next(error);
  }
};
