import "dotenv/config";
import { Types } from "mongoose";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt, { compare } from "bcrypt";

import { RefreshToken, IRefreshToken } from "../models/RefreshToken";
// import jwt, { JsonWebTokenError } from "jsonwebtoken";
import logger from "../utils/logger";

// add refresh token
export async function addRefreshToken(user_id: Types.ObjectId, token: string) {
  logger.debug(`addRefreshToken()`, { user_id, token });
  if (!user_id && !token) {
    throw new Error("user_id and token not provided");
  }

  try {
    if (!process.env.JWT_RT_SECRET) {
      throw new Error("secret key not provided");
    }
    const decoded = jwt.verify(token, process.env.JWT_RT_SECRET) as JwtPayload;
    if (decoded) {
      const expires_at = new Date((decoded.exp as number) * 1000);

      const refreshToken = new RefreshToken({ user_id, token, expires_at });
      const res = await refreshToken.save();
      console.info("addRefreshtoken: ", res);
    }
  } catch (error) {
    logger.error(`error in addRefreshToken()`);
    throw error;
  }
}
// revoke refresh token
export async function revokeRefreshToken(token: string) {
  try {
    logger.debug(`revokeRefreshToken()`, { token });
    const refreshToken = await RefreshToken.findOne({ token });
    if (refreshToken) {
      if (!Types.ObjectId.isValid(refreshToken.id)) return null;
      return await RefreshToken.findByIdAndUpdate(
        refreshToken.id,
        { revoked: true },
        { new: true }
      );
    }
    throw new Error(
      "refresh token not exist, can not generate new refresh token"
    );
  } catch (error) {
    logger.error(`error in revokeRefreshToken()`);
    throw error;
  }
}

export async function isRefreshTokenExist(token: string) {
  logger.debug(`isRefreshTokenExist()`, { token });
  if (!token) {
    throw new Error(
      "refresh token not exist, can not generate new refresh token"
    );
  }
  try {
    const refreshToken = await RefreshToken.findOne({ token, revoked: false });
    if (refreshToken) {
      return true;
    }
    return false;
  } catch (error) {
    logger.error(`error in isRefreshTokenExist()`);
    throw error;
  }
}

export async function removeUserRefreshToken(user_id: Types.ObjectId){
  if (!user_id) {
    throw new Error("user_id not provided");
  }
  try {
    logger.debug('removeUserRefreshToken()', {user_id})
    await RefreshToken.deleteMany({ user_id });
 
  } catch (error) {
    logger.error('Error in removeUserRefreshToken()')
    throw error
  }
}
