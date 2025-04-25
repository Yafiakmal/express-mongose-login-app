import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// Schema validasi dengan Zod
const registerSchema = z.object({
  email: z.string().email("Invalid Email"),
  password: z
    .string()
    .min(6, "Minimal password is 6 character")
    .max(100, "Maksimal password is 100 karakter"),
  username: z
    .string()
    .min(3, "Minimal username is 3 character")
    .max(20, "Maksimal username is 20 karakter")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username hanya boleh huruf, angka, dan underscore"
    ),
});

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validasi request body terhadap schema
    registerSchema.parse(req.body);
    next(); // Lanjut ke controller jika valid
  } catch (error) {
    next(error);
  }
};
