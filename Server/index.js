import express from "express";
import dotenv from "dotenv"
import {Database_Connection} from "./Database/Connection.js"

const app = express();

const PORT = 8000;

dotenv.config();

Database_Connection();

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});
