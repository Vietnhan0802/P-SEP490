import React from "react";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../scss/header.scss";
import Cookies from "js-cookie";
import { Row, Col, Image } from "react-bootstrap";
import { CiSearch } from "react-icons/ci";
import { LuHome } from "react-icons/lu";
import logoImg from "../images/common/logo.png";
import Avatar from "../images/common/Avatar.png";
import { IoChatbubblesOutline } from "react-icons/io5";
import { IoIosNotificationsOutline } from "react-icons/io";
export default function Header() {
  // const user = JSON.parse(Cookies.get("user"));
  const [activeItem, setActiveItem] = useState("home");
  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
  };
  return (
    <Row className="header">
      <Col className="d-flex align-items-center">
        <Image src={logoImg} className="logo" />
        <div className="d-flex search align-items-center">
          <CiSearch className="" />
          <input type="text" placeholder="Search" className="search-box" />
        </div>
      </Col>
      <Col className="justify-content-center d-flex align-items-center">
        <LuHome
          className={`home-icon ${
            activeItem === "home" ? "active-header-item" : ""
          }`}
          onClick={()=> handleItemClick("home")}
        />
        <IoChatbubblesOutline
          className={`chat-icon ${
            activeItem === "chat" ? "active-header-item" : ""
          }`}
          onClick={()=> handleItemClick("chat")}
        />
        <IoIosNotificationsOutline
          className={`notify-icon ${
            activeItem === "notify" ? "active-header-item" : ""
          }`}
          onClick={()=> handleItemClick("notify")}
        />
      </Col>
      <Col className="d-flex justify-content-end align-items-center">
        <div className=" d-flex align-items-center">
          <img src={Avatar} alt="" className="avatar" />
          <div className="ms-2">
            {/* <p>{user.FullName}e</p>
            <p>{user.Email}</p> */}
          </div>
        </div>
      </Col>
    </Row>
  );
}
