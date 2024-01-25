import React, { useEffect } from "react";
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
import defaultImage from "../images/common/default.png"
import Popup from "./Popup/Popup";
import Notify from "../page/Notify/notify";
import { userInstance } from "../axios/axiosConfig";
export default function Header({ activeComponent, onItemClick ,changeImage}) {
  const user = JSON.parse(Cookies.get("user"));
  const [activeItem, setActiveItem] = useState("home");
  const [activePopup, setActivePopup] = useState(false); 
  const [showPopup, setShowPopup] = useState(false);
  const [value, setValue] = useState({  imageSrc: '' });
  const  imageSrc =defaultImage;
  useEffect(() => {
    userInstance.get(`/GetUserById/${user.Id}`)
      .then((res) => {
        if(res?.data?.result.imageSrc === 'https://localhost:7006/Images/') return; 
        setValue( res?.data?.result.imageSrc,
        )
        console.log(res?.data?.result.imageSrc);
      })
      .catch((err) => {
        console.log(err.response.data);
      })
   }, [changeImage]);
  const handlePopup = () => {
    setShowPopup(!showPopup);
    setActivePopup(!activePopup);
  };
  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    onItemClick(itemId);
  };
  const handleAvatarClick = () => {
    // Set activeItem to "profile" when the avatar is clicked
    onItemClick("profile");
  };
  return (
    <Row id="header" className="m-0">
      <Col className="d-flex align-items-center" sm={4}>
        <Image src={logoImg} className="logo" />
        <div className="d-flex search align-items-center">
          <CiSearch className="" />
          <input type="text" placeholder="Search" className="search-box" />
        </div>
      </Col>
      <Col className="justify-content-center d-flex align-items-center" sm={4}>
        <LuHome
          className={`home-icon ${
            activeItem === "home" ? "active-header-item" : ""
          }`}
          onClick={() => handleItemClick("home")}
        />
        <IoChatbubblesOutline
          className={`chat-icon ${
            activeItem === "chat" ? "active-header-item" : ""
          }`}
          onClick={() => handleItemClick("chat")}
        />

        <div >
          <IoIosNotificationsOutline
            className={`notify-icon ${
              activePopup === true ? "active-header-item" : ""
            }`}
            onClick={() => handlePopup()}
          />
          <Popup trigger={showPopup}>
            <Notify />
          </Popup>
        </div>
      </Col>
      <Col className="d-flex justify-content-end align-items-center" sm={4}>
        <div className=" d-flex align-items-center" onClick={handleAvatarClick}>
          <img src={value} alt="" className="avatar" />
          <div className="ms-2">
            <p>{user.FullName}</p>
            <p>{user.Email}</p>
          </div>
        </div>
      </Col>
    </Row>
  );
}
