import React from "react";

import { Sidebar } from "flowbite-react";

import { HiUser, HiArrowSmRight } from "react-icons/hi";

import { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const LeftSidebar = () => {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFormURL = urlParams.get("tab");

    if (tabFormURL) {
      setTab(tabFormURL);
    }

    console.log(tabFormURL);
  }, [location.search]);

  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to={"/dashboard?tab=profile"}>
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={"User"}
              labelColor="dark"
              className="cursor-pointer"
            >
              Profie
            </Sidebar.Item>
          </Link>
          <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer">
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default LeftSidebar;
