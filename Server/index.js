import express from "express";
import dotenv from "dotenv";
import { Database_Connection } from "./Database/Connection.js";
import userRoute from "./Routes/userRoute.js";

const app = express();

const PORT = 8000;

dotenv.config();

// Routes

app.use("/api/users", userRoute);

Database_Connection();

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});
