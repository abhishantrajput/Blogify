import express from "express";
import dotenv from "dotenv";
import { Database_Connection } from "./Database/Connection.js";
import userRoute from "./Routes/userRoute.js";
import authRoute from "./Routes/authRoute.js";
import cookieParser from "cookie-parser"

const app = express();

const PORT = 8000;

dotenv.config();

// important middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// Routes

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";


  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

Database_Connection();

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});
