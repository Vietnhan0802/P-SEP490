import React from "react";
import { useState } from "react";
import Cookies from "js-cookie";
import "../scss/sidebar.scss";
import { GoPencil } from "react-icons/go";
import { FiBookOpen } from "react-icons/fi";
import { TbFloatLeft } from "react-icons/tb";
import { LuBook } from "react-icons/lu";
import { LuFileEdit } from "react-icons/lu";
import { FaRegCircleCheck } from "react-icons/fa6";
import { CiLogout } from "react-icons/ci";
import { FaFacebook } from "react-icons/fa";
import { GrTwitter } from "react-icons/gr";
import { IoLogoInstagram } from "react-icons/io5";
import { FaLinkedin } from "react-icons/fa";
import { MdOutlineSimCardDownload } from "react-icons/md";
import { MdOutlineSpaceDashboard } from "react-icons/md";

function SideBar({ activeItem, onItemClick }) {
  const sidebarItems = [
    { id: "post", icon: <GoPencil />, text: "Post", userRole: "all" },
    { id: "blog", icon: <FiBookOpen />, text: "Blog", userRole: "all" },
    {
      id: "own_post",
      icon: <TbFloatLeft />,
      text: "Own Post",
      userRole: "business",
    },
    {
      id: "own_project",
      icon: <LuBook />,
      text: "Own Project",
      userRole: "business",
    },
    {
      id: "project_application",
      icon: <LuFileEdit />,
      text: "Project Application",
      userRole: "business",
    },
    {
      id: "verification",
      icon: <FaRegCircleCheck />,
      text: "Send Verification",
      userRole: "business",
    },
    {
      id: "current_project",
      icon: <MdOutlineSimCardDownload />,
      text: "Current Project",
      userRole: "Person",
    },
    {
      id: "dashboard",
      icon: <MdOutlineSpaceDashboard />,
      text: "Dashboard",
      userRole: "admin",
    },
    // Add other sidebar items similarly
  ];
  const handleLogout = () => {
    Cookies.remove("user");
    Cookies.remove("role");
    window.location.href = "/";
  };
  const handleItemClick = (itemId) => {
    onItemClick(itemId);
  };
  const userRole = JSON.parse(Cookies.get("role")); // Assuming 'role' is a property in your user object
  // Filter sidebar items based on user's role
  const filteredSidebarItems = sidebarItems.filter((item) => {
    // Customize this condition based on your role logic
    return (
      item.userRole.toLowerCase() === userRole.toLowerCase() ||
      item.userRole.toLowerCase() === "all"
    );
  });
  return (
    <div
      className="mb-3 d-flex flex-column justify-content-between"
      id="sidebar"
    >
      <div className="upper-section">
        {filteredSidebarItems.map((item) => (
          <div
            key={item.id}
            className={`mb-3 d-flex align-items-center ${
              activeItem === item.id ? "active-sidebar-item" : ""
            }`}
            onClick={() => handleItemClick(item.id)}
          >
            {item.icon}
            <p className="ms-3">{item.text}</p>
          </div>
        ))}
      </div>
      <div className="lower-section">
        <div
          className="logout d-flex align-items-center"
          onClick={handleLogout}
        >
          <CiLogout className="logout-icon" />
          <p className="text ms-2">Log Out</p>
        </div>
        <p className="fw-bold fs-10 mt-2">
          Lorem ipsum · dolor sit amet · consectetur · Id ut nullam in nec
          ullamcorper
        </p>
        <p className="fs-10">© Copyright © 2024 | All Rights Reversed </p>
        <div className="mt-2">
          <FaFacebook className="fs-4 ms-2" />
          <GrTwitter className="fs-4 ms-2" />
          <IoLogoInstagram className="fs-4 ms-2" />
          <FaLinkedin className="fs-4 ms-2" />
        </div>
      </div>
    </div>
  );
}

export default SideBar;
