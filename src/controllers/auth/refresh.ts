import express from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

import { getUserByEmail } from "../../services/db_user.js";
import { generateAccessToken, generateRefreshToken } from "../../services/token.js";
import { revokeRefreshToken, addRefreshToken } from "../../services/db_refreshtoken.js";
import { error } from "../../label/error_label.js";
import {
  errorResponse,
  successResponse,
} from "../../types/http_response.js";
import getUser from "../user/getUser.js";


export default async (req: express.Request, res: express.Response, next:express.NextFunction)=>{
    // cek cookie in request
    try {
      const refreshToken = req.cookies['refreshTokenRefresh'];
      if(refreshToken){
        const payload  = jwt.decode(refreshToken) as jwt.JwtPayload
        const user = await getUserByEmail(payload.email)
        delete payload.exp
        delete payload.iat
        const nATToken = await generateAccessToken(payload)
        const nRTToken = await generateRefreshToken(payload)
        
        await revokeRefreshToken(refreshToken)
        await addRefreshToken(user?._id as Types.ObjectId, nRTToken)
                return res.cookie("refreshTokenRefresh", nRTToken, {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === "production",
                  sameSite: "strict",
                  path: "/api/auth/refresh",
                  maxAge: parseInt(process.env.JWT_RT_SECRET_EXPIN ? process.env.JWT_RT_SECRET_EXPIN : "604800") * 1000, // 7 hari
                }).status(200).json(
                  successResponse("you have successfully refresh", {
                    accessToken: nATToken,
                  })
                );
      }
      // throw new Error('refresh token not provided')
      return res.status(400).json(errorResponse(error.TOKEN_NOT_PROVIDED, 'please provide the refresh token'))
    } catch (error) {
      next(error)
    }
}