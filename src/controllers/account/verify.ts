import express from "express";
import 'dotenv/config'
import jwt, {JwtPayload} from 'jsonwebtoken'
import { updateUser } from "../../services/db_user";
import { error } from "../../label/error_label";
import {
  errorResponse,
  successResponse,
} from "../../types/http_response";
import logger from "../../utils/logger";
import { HttpError } from "../../error/HttpError";


export default async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
    try {
      logger.info(`${req.method} ${req.path}`,{path: req.path, method: req.method})
      const verCode = req.params.token;
      if(process.env.VERCODE_SECRET && verCode){
        const decoded = jwt.verify(verCode, process.env.VERCODE_SECRET)
        if(typeof decoded === 'object' && 'username' in decoded){
          const {username} = decoded as JwtPayload
          await updateUser(username, {is_verified:true})
          return res.status(200).json(successResponse(200, 'You have successfully verify your email', [{username, email:decoded.email}]))
        }
      }
      return next(new HttpError(401,error.URL_PARAMS_NOT_PROVIDED_0, 'internal error or please use valid verify code'))
      // return res.status(400).json(errorResponse(400,error.URL_PARAMS_NOT_PROVIDED, 'internal error or please use valid verify code'))
    } catch (err) {
      // logger.error(`${req.method} ${req.path}`,{error:err})
      next(err)
    }
}