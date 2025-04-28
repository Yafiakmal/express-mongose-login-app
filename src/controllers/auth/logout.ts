import express from "express";
import { error } from "../../label/error_label.js";
import { errorResponse, successResponse } from "../../types/http_response.js";
import { setRefreshTokenCookie } from "../../utils/cookie.js";
import { revokeRefreshToken } from "../../services/db_refreshtoken.js";
import logger from "../../utils/logger.js";

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
    const refreshToken = req.cookies["refreshTokenLogout"];
    // revoke refresh token
    await revokeRefreshToken(refreshToken);
    // set cookie refresh token
    setRefreshTokenCookie(
      res,
      "refreshTokenRefresh",
      "",
      "/api/auth/r",
      0
    );
    return res
      .status(200)
      .json(successResponse("You have successfully logout"));
  } catch (error) {
    // logger.error(`${req.method} ${req.path}`,{error:error})
    next(error);
  }
};
