import User from "../Models/userSchema.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import { setUser } from "../Services/service.js";
export const Register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (
      !username ||
      !email ||
      !password ||
      username == "" ||
      email == "" ||
      password == ""
    ) {
      return next(errorHandler(400, "All fields are Required"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      password: hashedPassword,
      email,
    });

    await user.save();

    return res.status(200).json({
      message: "User Created Successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are Required"));
  }

  try {
    const isValidUser = await User.findOne({ email });

    if (!isValidUser) {
      return next(errorHandler(404, "User Does not Exist"));
    }

    const { password: pass, ...rest } = isValidUser._doc;

    const isValidPassword = bcrypt.compareSync(password, isValidUser.password);

    if (!isValidPassword) {
      next(errorHandler("400", "Invalid Password"));
    }

    const token = setUser(isValidUser);
    console.log(token);

    return res.status(200).cookie("token", token, { httpOnly: true }).json({
      message: "Logged Successfully",
      success: true,
      rest,
    });
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (req, res, next) => {
  const { displayName: name, email, googlePhotoURL } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const token = setUser(existingUser);

      const { password, ...rest } = existingUser._doc;

      return res
        .status(200)
        .cookie("token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      const generatePassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatePassword, 10);

      const username =
        name
          .toLowerCase()
          .split("")
          .map((char) => (char.match(/[a-z0-9]/) ? char : ""))
          .join("")
          .slice(0, 9) + Math.random().toString(36).slice(-3);

      const newUser = new User({
        email,
        username,
        password: hashedPassword,
        photoURL: googlePhotoURL,
      });
      await newUser.save();
    }
  } catch (error) {
    next(error);
  }
};
