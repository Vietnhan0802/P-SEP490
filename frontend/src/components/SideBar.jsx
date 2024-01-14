import React from "react";
import { useState } from "react";
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
const sidebarItems = [
  { id: "post", icon: <GoPencil />, text: "Post" },
  { id: "blog", icon: <FiBookOpen />, text: "Blog" },
  { id: "own_post", icon: <TbFloatLeft />, text: "Own Post" },
  { id: "own_project", icon: <LuBook />, text: "Own Project" },
  {
    id: "project_application",
    icon: <LuFileEdit />,
    text: "Project Application",
  },
  { id: "application", icon: <FaRegCircleCheck />, text: "Send Application" },
  // Add other sidebar items similarly
];
function SideBar({ activeItem, onItemClick }) {


  const handleItemClick = (itemId) => {
    onItemClick(itemId);
  };
  return (
    <div className="sidebar mb-3">
      <div className="upper-section">
        {sidebarItems.map((item) => (
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
        <div className="logout d-flex align-items-center">
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
