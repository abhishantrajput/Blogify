import Post from "../Models/postSchema.js";
import { errorHandler } from "../utils/error.js";

export const createPost = async (req, res, next) => {
  console.log(req.body);

  const {title} = req.body;

  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You're not Allowed to Create Post"));
  }

  if (!req.body.title || !req.body.desc) {
    return next(
      errorHandler(400, "Please Fill up the Fields before Creating the Post")
    );
  }

  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "-");

    const titleExit = await Post.findOne({title})
    console.log(titleExit)

  if (titleExit) {
    return next(errorHandler(400,"Title already Existed!! . please select the another Title "));
  }

  const newPost = new Post({
    title: req.body.title,
    content: req.body.desc,

    slug,

    userId: req.user.id,
  });

  try {
    const savedPost = await newPost.save();

    return res.status(200).json(savedPost);
  } catch (error) {
    return next(error);
  }
};
