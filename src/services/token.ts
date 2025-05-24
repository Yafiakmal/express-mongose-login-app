import "dotenv/config";
import jwt from "jsonwebtoken";

import logger from "../utils/logger";

export async function generateAccessToken(payload: object) {
  logger.debug(`generateAccessToken()`, { payload });
  if (!process.env.JWT_AT_SECRET) {
    throw new Error("JWT access token secret is not defined");
  }

  const now = Math.floor(Date.now() / 1000);
  const tokenPayload = {
    ...payload,
    iat: now,
    exp:
      now +
      parseInt(
        process.env.JWT_AT_SECRET_EXPIN
          ? process.env.JWT_AT_SECRET_EXPIN
          : "300"
      ), // 5 menit
  };

  return jwt.sign(tokenPayload, process.env.JWT_AT_SECRET);
}

export async function generateRefreshToken(payload: object) {
  logger.debug(`generateAccessToken()`, { payload });
  if (!process.env.JWT_RT_SECRET) {
    throw new Error("JWT refresh token secret is not defined");
  }

  const now = Math.floor(Date.now() / 1000);
  const tokenPayload = {
    ...payload,
    iat: now,
    exp:
      now +
      parseInt(
        process.env.JWT_RT_SECRET_EXPIN
          ? process.env.JWT_RT_SECRET_EXPIN
          : "604800"
      ), // 7 hari
  };

  return jwt.sign(tokenPayload, process.env.JWT_RT_SECRET);
}
