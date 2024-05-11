import express from "express";
import { userUpdate } from "../Controllers/userController.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", (req, res) => {
  return res.send("User are getting...");
});

router.put("/update/:userId", verifyToken, userUpdate);

export default router;
