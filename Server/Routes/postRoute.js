import express from "express";

import { verifyToken } from "../utils/verifyUser.js";

import {
  createPost,
  deletePost,
  getposts,
  updatePost,
} from "../Controllers/postController.js";

const router = express.Router();

router.post("/create", verifyToken, createPost);
router.get("/getposts", getposts);
router.delete("/deletepost/:userId/:postId", verifyToken, deletePost);
router.put("/updatepost/:postId/:userId", verifyToken, updatePost);

export default router;
