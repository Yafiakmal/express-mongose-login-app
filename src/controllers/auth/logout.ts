import express from "express";
import { error } from "../../label/error_label.js";
import {
  errorResponse,
  successResponse,
} from "../../types/http_response.js";
import { setRefreshTokenCookie } from "../../utils/cookie.js";
import { revokeRefreshToken } from "../../services/db_refreshtoken.js";

export default async (req: express.Request, res: express.Response, next:express.NextFunction)=>{
    try {
      const refreshToken = req.cookies['refreshTokenLogout'];
      // revoke refresh token
      await revokeRefreshToken(refreshToken)
      // set cookie refresh token
      setRefreshTokenCookie(res,"refreshTokenRefresh","", "/api/auth/refresh", 0)
      setRefreshTokenCookie(res,"refreshTokenLogout", "","/api/auth/logout", 0)
      return res.status(200).json(successResponse('you have successfully logout'))
    } catch (error) {
      next(error)
    }
}