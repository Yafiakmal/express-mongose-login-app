import express from "express";
import { error } from "../../label/error_label";
import { errorResponse, successResponse } from "../../types/http_response";
import { setRefreshTokenCookie } from "../../utils/cookie";
import { revokeRefreshToken } from "../../services/db_refreshtoken";
import logger from "../../utils/logger";

export default async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    logger.info(`${req.method} ${req.path}`, {
      path: req.path,
      method: req.method,
      cookies: req.cookies,
    });
    const refreshToken = req.cookies["refreshTokenRefresh"];
    // revoke refresh token
    await revokeRefreshToken(refreshToken);
    // set cookie refresh token
    setRefreshTokenCookie(
      res,
      "refreshTokenRefresh",
      refreshToken,
      "/api/auth/r",
      0
    );
    return res
      .status(200)
      .json(successResponse(200, "You have successfully logout"));
  } catch (error) {
    // logger.error(`${req.method} ${req.path}`,{error:error})
    next(error);
  }
};
