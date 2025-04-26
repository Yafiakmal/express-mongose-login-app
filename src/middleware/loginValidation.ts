import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// Schema validasi dengan Zod
const loginSchema = z.object({
  identifier: z.string(),
  password: z
    .string()
    .min(6, "Minimal password is 6 character")
    .max(100, "Maksimal password is 100 karakter")
});

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validasi request body terhadap schema
    loginSchema.parse(req.body);
    next(); // Lanjut ke controller jika valid
  } catch (err) {
    next(err)
  }
};
