import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button, Label, TextInput, Alert, Spinner } from "flowbite-react";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";

const SignIn = () => {
  const [formdata, setFormData] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading: isLoading, error: errMessage } = useSelector(
    (state) => state.user
  );

  console.log(formdata);
  const handleOnChange = (e) => {
    setFormData({ ...formdata, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formdata.password || !formdata.email) {
      return dispatch(signInFailure("Please fill out the fields"));
    }

    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });

      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        dispatch(signInSuccess(data.rest));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
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
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your Email" />
              <TextInput
                placeholder="Email"
                id="email"
                type="email"
                onChange={handleOnChange}
              />
            </div>
            <div>
              <Label value="Password" />
              <TextInput
                placeholder="********"
                id="password"
                type="password"
                onChange={handleOnChange}
              />
            </div>

            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign up"
              )}
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-2">
            <span>Don't have an Account?</span>

            <Link to={"/signup"} className="text-blue-500">
              {" "}
              Sign Up
            </Link>
          </div>

          {errMessage && (
            <Alert className="mt-5" color={"failure"}>
              {" "}
              {errMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
