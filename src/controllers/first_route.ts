import express from "express";
import { createUser, getAllUsers } from "../services/db_user.js";
import { error } from "../label/error_label.js";
import { errorResponse, successResponse } from "../types/http_response.js";

export default async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    res.render("index",{title:"Project Portofolio", name:"Muhammad Yafi Akmal"})
  } catch (err) {
    res.render("error",{msg:"Error Starting Server", err:err})
  }
};
