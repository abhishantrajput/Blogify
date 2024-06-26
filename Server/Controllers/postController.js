import Post from "../Models/postSchema.js";
import { errorHandler } from "../utils/error.js";

export const createPost = async (req, res, next) => {
  console.log(req.body);

  const { title, image, category } = req.body;

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

  const titleExit = await Post.findOne({ title });
  console.log(titleExit);

  if (titleExit) {
    return next(
      errorHandler(
        400,
        "Title already Existed!! . please select the another Title "
      )
    );
  }

  const newPost = new Post({
    title: req.body.title,
    content: req.body.content,

    slug,
    image,
    category,

    userId: req.user.id,
  });

  try {
    const savedPost = await newPost.save();

    return res.status(200).json(savedPost);
  } catch (error) {
    return next(error);
  }
};

export const getposts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You're Not Allowed to Delete this Post"));
  }

  try {
    await Post.findByIdAndDelete(req.params.postId);

    return res.status(200).json("The Post has been Deleted");
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.params.userId !== req.user.id) {
    return next(errorHandler(403, "You're Not allowed to Update this Post"));
  }

  try {

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
  
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          image: req.body.image,
          category: req.body.category,
        },
      },
      { new: true }
    );
  
  
  
    return res.status(200).json(updatedPost)
    
  } catch (error) {


    next(error)
    
  }
};
