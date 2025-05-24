import express from "express";

import logger from "../utils/logger";
import { error } from "../label/error_label";
import { errorResponse, successResponse } from "../types/http_response";

export default async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    logger.info(`GET /`)
    res.render("index",{title:"Project Portofolio", name:"Muhammad Yafi Akmal"})
  } catch (err) {
    res.render("error",{msg:"Error Starting Server", err:err})
  }
};
