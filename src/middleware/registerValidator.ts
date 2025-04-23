import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// Schema validasi dengan Zod
const registerSchema = z.object({
  email: z.string().email("Invalid Email"),
  password: z.string().min(6, "Minimal password 6 character"),
  username: z.string().min(3, "Minimal username 3 character"),
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
    next(error)
  }
};
