import register from "../../../src/controllers/account/register";
import { Request, Response, NextFunction } from "express";
import {
    createOneUser,
    getAllUsers,
    isUsernameExist,
    isEmailExist,
  } from "../../../src/services/db_user"; // ← .js
  
import jwt from "jsonwebtoken";
import mailer from "../../../src/config/mailer";

jest.mock("../../../src/services/db_user");
jest.mock("../../../src/config/mailer");
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mocked_token"),
}));

describe("register controller", () => {
  it("[success case] should create a user and send email", async () => {
    process.env.VERCODE_SECRET = "secret";

    const req = {
      method: "POST",
      path: "/register",
      body: {
        username: "akmal",
        email: "akmal@email.com",
        password: "123456",
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    (isUsernameExist as jest.Mock).mockResolvedValue(false);
    (isEmailExist as jest.Mock).mockResolvedValue(false);
    (createOneUser as jest.Mock).mockResolvedValue(undefined);
    (mailer as jest.Mock).mockResolvedValue(undefined);

    await register(req, res, next);

    expect(createOneUser).toHaveBeenCalled();
    expect(mailer).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 200,
      message: `Email are sent to ${req.body.email}`,
    //   data: undefined,
    });
  });
});
