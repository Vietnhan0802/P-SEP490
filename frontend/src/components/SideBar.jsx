import React from "react";
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
function SideBar() {
  return (
    <div className="sidebar">
      <div className="upper-section">
        <div className="mb-3 d-flex align-items-center active-sidebar-item">
          <GoPencil className="me-3" />
          Post
        </div>
        <div className="mb-3 d-flex align-items-center ">
          <FiBookOpen className="me-3" />
          Blog
        </div>
        <div className="mb-3 d-flex align-items-center ">
          <TbFloatLeft className="me-3" />
          Own Post
        </div>
        <div className="mb-3 d-flex align-items-center ">
          <LuBook className="me-3" />
          Own Project
        </div>
        <div className="mb-3 d-flex align-items-center ">
          <LuFileEdit className="me-3" />
          Project Application
        </div>
        <div className="mb-3 d-flex align-items-center ">
          <FaRegCircleCheck className="me-3" />
          Send Application
        </div>
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
          <FaFacebook  className="fs-4 ms-2" />
          <GrTwitter  className="fs-4 ms-2" />
          <IoLogoInstagram  className="fs-4 ms-2" />
          <FaLinkedin className="fs-4 ms-2" />
        </div>
      </div>
    </div>
  );
}

export default SideBar;
