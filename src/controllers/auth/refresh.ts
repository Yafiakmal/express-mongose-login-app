import express from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

import { getUserByEmail } from "../../services/db_user.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../services/token.js";
import {
  revokeRefreshToken,
  addRefreshToken,
} from "../../services/db_refreshtoken.js";
import { setRefreshTokenCookie } from "../../utils/cookie.js";
import { error } from "../../label/error_label.js";
import { errorResponse, successResponse } from "../../types/http_response.js";
import getUser from "../user/getUser.js";

export default async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  // cek cookie in request
  try {
    const refreshToken = req.cookies["refreshTokenRefresh"];
    if (refreshToken) {
      const payload = jwt.decode(refreshToken) as jwt.JwtPayload;
      const user = await getUserByEmail(payload.email);
      delete payload.exp;
      delete payload.iat;
      const nATToken = await generateAccessToken(payload);
      const nRTToken = await generateRefreshToken(payload);

      await revokeRefreshToken(refreshToken);
      await addRefreshToken(user?._id as Types.ObjectId, nRTToken);
      setRefreshTokenCookie(res, "refreshTokenRefresh", nRTToken,"/api/auth/refresh", parseInt(
        process.env.JWT_RT_SECRET_EXPIN
          ? process.env.JWT_RT_SECRET_EXPIN
          : "604800"
      ) * 1000,)
      setRefreshTokenCookie(res, "refreshTokenLogout", nRTToken,"/api/auth/logout", parseInt(
        process.env.JWT_RT_SECRET_EXPIN
          ? process.env.JWT_RT_SECRET_EXPIN
          : "604800"
      ) * 1000,)
      return res
        .status(200)
        .json(
          successResponse("you have successfully refresh", {
            accessToken: nATToken,
          })
        );
    }
    // throw new Error('refresh token not provided')
    return res
      .status(400)
      .json(
        errorResponse(
          error.TOKEN_NOT_PROVIDED,
          "please provide the refresh token"
        )
      );
  } catch (error) {
    next(error);
  }
};
