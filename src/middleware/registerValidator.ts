import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// Schema validasi dengan Zod
const registerSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  username: z.string().min(1, "Nama wajib diisi"),
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
