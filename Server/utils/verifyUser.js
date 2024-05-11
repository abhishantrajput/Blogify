import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";


export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(errorHandler(401, "User Unauthorized!"));
  }

  if (token) {
    return jwt.verify(token, process.env.JWT_secret, (err, user) => {
      if (err) {
        return next(errorHandler(401, "Unauthorized"));
      }

      req.user = user;

      console.log(req.user)

      next();
    });
  }
};
