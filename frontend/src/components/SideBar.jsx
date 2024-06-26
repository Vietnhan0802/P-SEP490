import React, { useState } from "react";
import Cookies from "js-cookie";
import "../scss/sidebar.scss";
import { FaUserPlus } from "react-icons/fa";
import { GoPencil } from "react-icons/go";
import { FiBookOpen } from "react-icons/fi";
import { TbFloatLeft } from "react-icons/tb";
import { LuBook } from "react-icons/lu";
import { LuFileEdit } from "react-icons/lu";
import { CiLogout } from "react-icons/ci";
import { FaFacebook } from "react-icons/fa";
import { GrTwitter } from "react-icons/gr";
import { IoLogoInstagram } from "react-icons/io5";
import { FaLinkedin } from "react-icons/fa";
import { MdOutlineSimCardDownload } from "react-icons/md";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FaChartLine } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
function SideBar({ itemClick }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [reset, setReset] = useState(false);
  const { activeItem } = location.state || {};
  const sidebarItems = [
    { id: "post", icon: <GoPencil />, text: t("post"), userRole: "all" },
    { id: "blog", icon: <FiBookOpen />, text: t("blog"), userRole: "all" },
    {
      id: "ownpost",
      icon: <TbFloatLeft />,
      text: "Own Post",
      userRole: "business",
    },
    {
      id: "project",
      icon: <LuBook />,
      text: "Projects",
      userRole: "all",
    },
    {
      id: "ownproject",
      icon: <LuBook />,
      text: "Own Project",
      userRole: "business",
    },
    {
      id: "projectapplication",
      icon: <LuFileEdit />,
      text: "Project Application",
      userRole: "business",
      otherRole: "member",
    },
    {
      id: "invitation",
      icon: <FaUserPlus />,
      text: "Project Invitation",
      userRole: "business",
      otherRole: "member",
    },
    {
      id: "currentproject",
      icon: <MdOutlineSimCardDownload />,
      text: "Current Project",
      userRole: "member",
    },
    {
      id: "dashboard",
      icon: <MdOutlineSpaceDashboard />,
      text: t("dashboard"),
      userRole: "admin",
    },
    {
      id: "statistic",
      icon: <FaChartLine />,
      text: t("statistic"),
      userRole: "admin",
    },
    // Add other sidebar items similarly
  ];
  const handleLogout = () => {
    sessionStorage.removeItem("userSession");
    navigate("/");
  };
  const handleItemClick = (itemId) => {
    itemClick();
    navigate(`/${itemId}`, { state: { activeItem: itemId } });
  };
  const sessionData = JSON.parse(sessionStorage.getItem("userSession")) || {};
  const { role } = sessionData;
  // Filter sidebar items based on user's role
  const filteredSidebarItems = sidebarItems.filter((item) => {
    // Customize this condition based on your role logic
    return (
      item?.userRole?.toLowerCase() === role?.toLowerCase() ||
      item?.userRole?.toLowerCase() === "all" ||
      item?.otherRole?.toLowerCase() === role?.toLowerCase()
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
          <p className="text ms-2" style={{ cursor: "pointer" }}>
            {t("logout")}
          </p>
        </div>
        <p className="fw-bold fs-10 mt-2">
          {/* Lorem ipsum · dolor sit amet · consectetur · Id ut nullam in nec
          ullamcorper */}
        </p>
        <p className="fw-bold fs-10">{t("logout_bottom")} </p>
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
