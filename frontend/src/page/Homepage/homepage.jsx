import React from "react";
import { useState } from "react";
import Header from "../../components/header";
import { Col, Row } from "react-bootstrap";
import SideBar from "../../components/SideBar";
// import "./homepage.scss";
import Follow from "../../components/follow";
import Post from "../Post/post";
import Cookies from "js-cookie";
import Blog from "../Blog/blog";
import Profile from "../Profile/profile";
import DashBoard from "../DashBoard/dashBoard";
function Homepage() {
  const [activeComponent, setActiveComponent] = useState("post");
  // console.log(Cookies.get('user'));
  // console.log(user.Email);

  const handleSidebarItemClick = (itemId) => {
    setActiveComponent(itemId);
  };
  return (
    <div className="bg m-0">
            <Header
        activeComponent={activeComponent}
        onItemClick={handleSidebarItemClick}
      />
      {activeComponent !== "dashboard" ? (<>
        <Row className="mt-3 ms-0 me-0">
        <Col md={3}>
          <SideBar
            activeItem={activeComponent}
            onItemClick={handleSidebarItemClick}
          />
        </Col>
        <Col md={6}>
          {activeComponent === "post" && <Post />}
          {activeComponent === "blog" && <Blog />}
          {activeComponent === "profile" && <Profile />}
          {activeComponent === "dashboard" && <DashBoard />}
          {/* Render Blog component when activeComponent is "blog" */}
        </Col>
        <Col md={3}> <Follow /></Col>
      </Row>
      </>) :<>
      
      <Row className="mt-3 ms-0 me-0">
        <Col md={3}>
          <SideBar
            activeItem={activeComponent}
            onItemClick={handleSidebarItemClick}
          />
        </Col>
        <Col md={9}>
         <DashBoard />
          {/* Render Blog component when activeComponent is "blog" */}
        </Col>
      </Row></> }

      
    </div>
  );
}

export default Homepage;
