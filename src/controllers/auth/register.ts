import express from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import {
  createOneUser,
  getAllUsers,
  isUsernameExist,
  isEmailExist,
} from "../../services/db_user.js";
import { error } from "../../label/error_label.js";
import { errorResponse, successResponse } from "../../types/http_response.js";
import mailer from "../../config/mailer.js";

export default async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { username, email, password } = req.body;

    // check user exist
    if (!(await isUsernameExist(username))) {
      if (!(await isEmailExist(email))) {
        if (process.env.VERCODE_SECRET) {
          // create user
          await createOneUser({ username, email, password })
          const verCode = jwt.sign(
            { username, email, password },
            process.env.VERCODE_SECRET, 
            {expiresIn:180}
          );
          // send email
          console.info(`register token:`, verCode)
          await mailer(email, verCode);
          return res
            .status(200)
            .json(successResponse(`Email are sent to ${email}`));
        }
        next(new Error("Environment variable are not set"));
      }
    }
    res
      .status(401)
      .json(
        errorResponse(
          error.EXISTING_CREDENTIALS,
          `Username Or Email Already Exist`
        )
      );
  } catch (err) {
    next(err);
  }
};
