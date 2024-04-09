import User from "../Models/userSchema.js";
import bcryptjs from "bcryptjs";

export const Register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password || username == "" || email == "" || password == "") {
      return res.status(400).json({
        message: "All fields are Required",
      });
    }

    const user1 = await User.find({ email });

    const exitstedUsername = await User.find({ username });

    if (exitstedUsername.length > 0) {
      return res.status(400).json({
        message: "username  not Available",
      });
    }

    if (user1.length > 0) {
      return res.status(400).json({
        message: "Email already Exists",
      });
    }


    const hashedPassword = bcryptjs.hashSync(password, 10);

    const user = new User({
      username,
      password : hashedPassword,
      email,
    });

    await user.save();

    return res.status(200).json({
      message: "User Created Successfully",
      data: user,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Somthing Error got Occured",
      Error: error,
    });
  }
};
