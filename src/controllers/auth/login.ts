import express from "express";
import bcrypt from "bcrypt";
import { Types } from "mongoose";

import { setRefreshTokenCookie } from "../../utils/cookie.js";
import {
  isUsernameExist,
  isEmailExist,
  comparePassByUsername,
  comparePassByEmail,
  getUserByEmail,
  getUserByUsername,
} from "../../services/db_user.js";
import { addRefreshToken } from "../../services/db_refreshtoken.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../services/token.js";
import { error } from "../../label/error_label.js";
import { errorResponse, successResponse } from "../../types/http_response.js";

export default async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { identifier, password } = req.body;
    // check username/email exist
    if (await isEmailExist(identifier)) {
      if (await comparePassByEmail(identifier, password)) {
        // generate accestoken and refresh token
        const user = await getUserByEmail(identifier);
        const payload = { email: identifier, username: user?.username };
        const token = await generateRefreshToken(payload);
        await addRefreshToken(user?._id as Types.ObjectId, token);
        setRefreshTokenCookie(
          res,
          "refreshTokenRefresh",
          token,
          "/api/auth/refresh",
          parseInt(process.env.JWT_RT_SECRET_EXPIN || "604800") * 1000
        );
        setRefreshTokenCookie(
          res,
          "refreshTokenLogout",
          token,
          "/api/auth/logout",
          parseInt(process.env.JWT_RT_SECRET_EXPIN || "604800") * 1000
        );

        return res.status(200).json(
          successResponse("you have successfully login", {
            accessToken: await generateAccessToken(payload),
          })
        );
      }
      return res
        .status(400)
        .json(errorResponse(error.INVALID_CREDENTIALS, "Credential Not Match"));
      // error credential invalid
    } else if (await isUsernameExist(identifier)) {
      if (await comparePassByUsername(identifier, password)) {
        // generate accestoken and refresh token
        const user = await getUserByUsername(identifier);
        const payload = { username: identifier, email: user?.email };
        const token = await generateRefreshToken(payload);
        await addRefreshToken(user?._id as Types.ObjectId, token);
        setRefreshTokenCookie(
          res,
          "refreshTokenRefresh",
          token,
          "/api/auth/refresh",
          parseInt(process.env.JWT_RT_SECRET_EXPIN || "604800") * 1000
        );
        setRefreshTokenCookie(
          res,
          "refreshTokenLogout",
          token,
          "/api/auth/logout",
          parseInt(process.env.JWT_RT_SECRET_EXPIN || "604800") * 1000
        );

        return res.status(200).json(
          successResponse("you have successfully login", {
            accessToken: await generateAccessToken(payload),
          })
        );
      }
      // error credential invalid
      return res
        .status(400)
        .json(errorResponse(error.INVALID_CREDENTIALS, "Credential Not Match"));
    }
    return res
      .status(400)
      .json(errorResponse(error.INVALID_CREDENTIALS, "Credential Not Match"));
  } catch (err) {
    console.error(`Error at login :`, err);
    next(err);
  }
};
