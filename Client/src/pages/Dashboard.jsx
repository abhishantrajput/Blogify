import React, { useState, useEffect } from "react";

import { useLocation } from "react-router-dom";
import ProfileDashboard from "../components/ProfileDashboard";
import LeftSidebar from "../components/LeftSidebar";

import Posts from "../components/Posts";

const Dashboard = () => {
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
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Sidebar Start */}

      <div className="md:w-56">
        {" "}
        <LeftSidebar />{" "}
      </div>

      {/* Left Sidebar Close */}

      {/* Profile Dashboard Start */}

      {tab === "profile" && <ProfileDashboard />}

      {tab === "posts" && <Posts />}

      {/* Profile Dashboard End */}
    </div>
  );
};

export default Dashboard;
