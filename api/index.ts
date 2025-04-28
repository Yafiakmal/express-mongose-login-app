import express from "express";
import { fileURLToPath } from "url";
import path from 'path';
import cookieParser from 'cookie-parser';
// import morgan from 'morgan';
// import { log } from "console";


import logger from "../src/utils/logger.js";
import { connectDB } from "../src/config/db_config.js";
import accountRouter from "../src/routes/account.route.js";
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

// const stream = {
//   write: (message: string) => logger.http(message.trim()),
// };

// app.use(morgan('combined', { stream }));
// app.use(morgan('combined'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// Main Route
app.get("/", first_route)
app.use("/api/auth", authRouter);
app.use("/api/account", accountRouter);

// 404 Middleware
app.use((req, res) => {
  logger.debug('RES 404')
  res.status(404).json(errorResponse(error.NOT_FOUND, "path not found"));
});

// Error Middleware
app.use(errorHandler);



app.listen(process.env.PORT || 3000, () => {
  logger.info(`Server running at port : ${process.env.PORT}`);
});
