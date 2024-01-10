import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../scss/header.scss";
import { Row, Col, Image } from "react-bootstrap";
import { CiSearch } from "react-icons/ci";
import { LuHome } from "react-icons/lu";
import logoImg from "../images/common/logo.png";
import Avatar from "../images/common/Avatar.png";
import { IoChatbubblesOutline } from "react-icons/io5";
import { IoIosNotificationsOutline } from "react-icons/io";
export default function Header() {
  return (
  
    <Row className="header">
      <Col className="d-flex align-items-center">
        <Image src={logoImg} className="logo" />
        <div className="d-flex search align-items-center" >
        <CiSearch className="" />
          <input type="text" placeholder="Search"  className="search-box" />
        </div>
      </Col>
      <Col className="justify-content-center d-flex align-items-center">
        <LuHome className="home-icon" />
        <IoChatbubblesOutline className="chat-icon" />
        <IoIosNotificationsOutline className="notify-icon" />
      </Col>
      <Col className="d-flex justify-content-end align-items-center">
        <div  className=" d-flex align-items-center">
          <img src={Avatar} alt="" className="avatar"/>
          <div  className="ms-2">
            <p>Luna Verse</p>
            <p>exxam@gmail.com</p>
          </div>
        </div>
      </Col>
    </Row>
    
  );
}
