import mongoose from "mongoose";


console.log()

export const Database_Connection = () => {
  mongoose
    .connect(process.env.MongoDB)
    .then(() => {
      console.log("MongoDB Database Has been Connected");
    })
    .catch((err) => {
      console.log(
        "There is some Error got Occurred throughout the Database Connection",
        err
      );
    });
};
