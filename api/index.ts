import express from "express";
import { connectDB } from "../src/models/db_config.js";
import userRouter from "../src/routes/user.route.js";
import authRouter from "../src/routes/auth.route.js";
import { error } from "../src/label/error_label.js";
import {
  errorResponse,
  successResponse,
} from "../src/types/http_response.js";
// await connectDB();

const app = express();
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

// 404 Middleware
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Error Middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json();
  }
);




// PERCOBAAN

// import { error } from "../src/label/error_label.js";
// import {
//   TestInterface,
//   ErrorResponse,
//   SuccessResponse,
// } from "../src/types/http_response.js";
// console.log(error.INVALID_EMAIL_FORMAT);

// function successResponse<T>(msg: string, data: T): SuccessResponse<T> {
//   return {
//     status: "success",
//     message: msg,
//     data: data,
//   };
// }

// function errorResponse(msg: string, label: error): ErrorResponse {
//   return {
//     status: "error",
//     label: label,
//     message: msg,
//   };
// }

// console.log(
//   errorResponse("username atau password salah", error.EXISTING_CREDENTIALS)
// );

// console.log(
//   successResponse("successfully registered", [
//     {id:1, username:"Muhammad Yafi Akmal"},
//     {id:2, username:"Budi Setiadi"}
//   ])
// )

// END PERCOBAAN

if (process.env.NODE_ENV !== "PRODUCTION") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

export default app;
