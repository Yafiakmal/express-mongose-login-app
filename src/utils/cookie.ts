import { Response } from "express";
import 'dotenv/config'
import { number } from "zod";

export function setRefreshTokenCookie(
  res: Response,
  cookieName:string,
  value: string,
  path: string,
  maxAge:number
): Response{
  const isProd = process.env.NODE_ENV === "production";

  return res.cookie(cookieName, value, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    path,
    maxAge,
  });
};
