import { useSelector } from "react-redux";
import React from "react";
import {Outlet} from "react-router-dom"
import { Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser ? <Outlet/> : <Navigate to={"/signin"} />
};

export default PrivateRoute;
