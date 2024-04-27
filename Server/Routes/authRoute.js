import { Register, login, googleAuth } from "../Controllers/authController.js";
import express from "express";

const router = express.Router();

router.post("/signup", Register);
router.post("/signin", login);
router.post("/google", googleAuth);

export default router;
