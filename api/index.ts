import express from "express";
import { connectDB } from "../src/config/db_config.js";
import userRouter from "../src/routes/user.route.js";
import authRouter from "../src/routes/auth.route.js";
import { error } from "../src/label/error_label.js";
import { errorResponse, successResponse } from "../src/types/http_response.js";
import { createUser, getAllUsers } from "../src/services/db_user.js";
await connectDB();

const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  res.json(
    await getAllUsers()
  )
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

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


app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});
