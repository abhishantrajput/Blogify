import User from "../Models/userSchema.js";
import { errorHandler } from "../utils/error.js";
import bcryptJs from "bcryptjs";

export const userUpdate = async (req, res, next) => {
  const { password, username, email, photoURL } = req.body;

  console.log("User Object Id ", req.user.id, "Params id ", req.params.userId);

  if (req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "You are not allowed to update this user's information")
    );
  }

  if (password && password.length < 8) {
    return next(errorHandler(400, "Password must be at least 8 characters"));
  }

  if (username) {
    if (username.length < 7 || username.length > 22) {
      return next(
        errorHandler(400, "Username must be between 7 to 22 characters")
      );
    }

    if (username.includes(" ")) {
      return next(errorHandler(400, "Username shouldn't contain spaces"));
    }

    if (username !== username.toLowerCase()) {
      return next(errorHandler(400, "Username should be in lowercase"));
    }
  }

  try {
    let updatedFields = {};
    if (password) {
      const hashedPassword = bcryptJs.hashSync(password, 10);
      updatedFields.password = hashedPassword;
    }

    if (username) {
      updatedFields.username = username;
    }

    if (email) {
      updatedFields.email = email;
    }

    if (photoURL) {
      updatedFields.photoURL = photoURL;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { $set: updatedFields },
      { new: true }
    );

    console.log("User updated successfully");

    const { password: pass, ...rest } = updatedUser._doc;

    return res.status(200).json(rest);
  } catch (error) {
    console.error("Error updating user:", error);
    return next(errorHandler(500, "Internal Server Error"));
  }
};

export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    next(errorHandler(403, "You are not authorized to Delete to this user"));
  }

  try {
    await User.findByIdAndDelete(req.user.id);

    return res.status(200).json("User has been deleted");
  } catch (error) {
    next(error);
  }
};

export const signOut = (req, res, next) => {
  try {
    res.clearCookie("token").status(200).json({ message: "user signout" });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are Not Allowed to See the Users"));
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0;

    const limit = parseInt(req.query.limit) || 9;

    const sortDirection = req.query.sort === "asc" ? 1 : -1;

    const users = await User.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const usersWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;

      return rest;
    });

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthsUsers = await User.countDocuments({
      createdAt: {
        $gte: oneMonthAgo,
      },
    });

    return res.status(200).json({
      users: usersWithoutPassword,
      totalUsers,
      lastMonthsUsers,
    });
  } catch (error) {
    next(error);
  }
};
