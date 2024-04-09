import express from "express";
import dotenv from "dotenv";
import { Database_Connection } from "./Database/Connection.js";
import userRoute from "./Routes/userRoute.js";
import authRoute from "./Routes/authRoute.js"

const app = express();

const PORT = 8000;

dotenv.config();


// important middlewares


app.use(express.json())
app.use(express.urlencoded({extended:true}))

// Routes

app.use("/api/users", userRoute);
app.use("/api/auth",authRoute)

Database_Connection();

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});
