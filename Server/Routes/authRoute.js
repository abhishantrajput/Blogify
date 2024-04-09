

import {Register} from "../Controllers/authController.js"
import express from "express"


const router = express.Router();



router.post("/signup",Register);



export default router