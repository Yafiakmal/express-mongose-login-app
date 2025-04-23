import express from "express";
import { fileURLToPath } from "url";
import path from 'path';
import { connectDB } from "../src/config/db_config.js";
import userRouter from "../src/routes/user.route.js";
import authRouter from "../src/routes/auth.route.js";
import first_route from "../src/controllers/first_route.js";
import errorHandler from "../src/middleware/errorHandler.js";
import { errorResponse } from "../src/types/http_response.js";
import { error } from "../src/label/error_label.js";

await connectDB();

const app = express();

app.set('view engine', 'ejs'); // pakai EJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', path.join(__dirname, '../src/views'));   // folder views

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Main Route
app.use("/", first_route)
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

// 404 Middleware
app.use((req, res) => {
  res.status(404).json(errorResponse(error.NOT_FOUND, "path not found"));
});

// Error Middleware
app.use(errorHandler);



app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running at http://localhost:${process.env.PORT}`);
});
