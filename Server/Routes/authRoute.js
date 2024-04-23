

import {Register, login} from "../Controllers/authController.js"
import express from "express"


const router = express.Router();



router.post("/signup",Register);
router.post("/signin",login);



export default router