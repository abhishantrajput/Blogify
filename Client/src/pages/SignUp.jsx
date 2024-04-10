import React from "react";
import { Link } from "react-router-dom";
import { Button, Label, TextInput } from "flowbite-react";

const SignUp = () => {
  return (
    <div className="min-h-screen mt-20">
      <div className="flex max-w-3xl p-3 mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* Left Container */}

        <div className="flex-1">
          <Link to={"/"} className="font-bold dark:white text-4xl">
            <span className="px-3 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Blogify
            </span>
          </Link>
          <p className="text-sm mt-5  ">
            This is a Blog Application where users can post, share and like
            different kinds of blogs.
          </p>
        </div>

        {/* Right Container */}

        <div className="flex-1">
          <form className="flex flex-col gap-4">
            <div className="">
              <Label value="Your username" />
              <TextInput
                placeholder="Write username"
                id="username"
                type="text"
              />
            </div>
            <div>
              <Label value="Your Email" />
              <TextInput
                placeholder="name@company.com"
                id="email"
                type="email"
              />
            </div>
            <div>
              <Label value="Password" />
              <TextInput
                placeholder="Write password"
                id="password"
                type="password"
              />
            </div>

            <Button gradientDuoTone="purpleToPink" type="submit">Sign Up</Button>
          </form>
          <div className="flex gap-2 text-sm mt-2">

            <span>Have an Account?</span>

            <Link to={"/signin"} className="text-blue-500"> Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
