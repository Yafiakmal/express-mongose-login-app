import express from "express";
import { error } from "../../label/error_label.js";
import {
  errorResponse,
  successResponse,
} from "../../types/http_response.js";

export default (req: express.Request, res: express.Response)=>{
    console.log("/api/users")
    res.json(successResponse("Get User Aman"));
}