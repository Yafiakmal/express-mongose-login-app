import express from "express";
import { createUser, getAllUsers } from "../../services/db_user.js";
import { error } from "../../label/error_label.js";
import { errorResponse, successResponse } from "../../types/http_response.js";

export default async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { username, email, password } = req.body;
    // validate input
    
    // check user exist
    // check email exist
    // hash password
    // send email

    console.log("\n\n/register\n", { username, email, password });
    await createUser({
      username: username,
      email: email,
      hpass: password,
    });
    res.json(successResponse("successfully registered", await getAllUsers()));
  } catch (err) {
    res.json();
  }
};
