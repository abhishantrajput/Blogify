

import express from "express"


import {verifyToken} from "../utils/verifyUser.js"

import {createPost, getposts} from "../Controllers/postController.js"

const router = express.Router();



router.post("/create",verifyToken,createPost)
router.get("/getposts", getposts)



export default router;