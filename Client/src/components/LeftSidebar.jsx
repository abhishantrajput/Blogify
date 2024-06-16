import React from "react";

import { Sidebar } from "flowbite-react";

import { HiUser, HiArrowSmRight, HiDocumentText } from "react-icons/hi";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import { useSelector } from "react-redux";

import { userSignOutSuccess } from "../redux/user/userSlice.js";
import { useLocation, Link } from "react-router-dom";

const LeftSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFormURL = urlParams.get("tab");

    if (tabFormURL) {
      setTab(tabFormURL);
    }

    console.log(tabFormURL);
  }, [location.search]);

  const handleUserSignOut = async () => {
    try {
      const res = await fetch("/api/users/signout", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(userSignOutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to={"/dashboard?tab=profile"}>
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              className="cursor-pointer"
              as="div"
            >
              Profie
            </Sidebar.Item>
          </Link>

          {currentUser.isAdmin && (
            <Link to={"/dashboard?tab=posts"}>
              <Sidebar.Item
                icon={HiDocumentText}
                labelColor="dark"
                className="cursor-pointer"
                as="div"
              >
                Posts
              </Sidebar.Item>
            </Link>
          )}
          <Sidebar.Item
            icon={HiArrowSmRight}
            className="cursor-pointer"
            onClick={handleUserSignOut}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default LeftSidebar;
