import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import SignIn from "../pages/SignIn.jsx";
import SignUp from "../pages/SignUp.jsx";
import About from "../pages/About.jsx";
import Projects from "../pages/Projects.jsx";
import OnlyAdminPrivateRoute from "./OnlyAdminPrivateRoute.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import CreatePost from "../pages/CreatePost.jsx";
import UpdatePost from "../pages/UpdatePost.jsx";
const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/about" element={<About />} />
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route element={<OnlyAdminPrivateRoute />}>
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/update-post/:postId" element={<UpdatePost/>} />
      </Route>
      <Route path="/projects" element={<Projects />} />
    </Routes>
  );
};

export default Router;
