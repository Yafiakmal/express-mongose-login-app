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
import logger from "../../utils/logger.js";
import { HttpError } from "../../error/HttpError.js";

export default async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    logger.info(`${req.method} ${req.path}`, {
      path: req.path,
      method: req.method,
    });
    logger.debug(`${req.method} ${req.path}`, {
      path: req.path,
      method: req.method,
      body: req.body,
    });
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
          "/api/auth/r",
          parseInt(process.env.JWT_RT_SECRET_EXPIN || "604800") * 1000
        );

        return res.status(200).json(
          successResponse(200, "you have successfully login", [
            {
              accessToken: await generateAccessToken(payload),
            },
          ])
        );
      }
      return res
        .status(400)
        .json(
          errorResponse(
            400,
            error.CREDENTIALS_INVALID_0,
            "Credential Not Match"
          )
        );
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
          "/api/auth/r",
          parseInt(process.env.JWT_RT_SECRET_EXPIN || "604800") * 1000
        );

        return res.status(200).json(
          successResponse(200, "you have successfully login", [
            {
              accessToken: await generateAccessToken(payload),
            },
          ])
        );
      }
      // error credential invalid
      return next(
        new HttpError(400, error.CREDENTIALS_INVALID_0, "Credential Not Match")
      );
    }
    return next(
      new HttpError(400, error.CREDENTIALS_INVALID_0, "Credential Not Match")
    );
  } catch (err) {
    // logger.error(`${req.method} ${req.path}`,{err:err})
    next(err);
  }
};
