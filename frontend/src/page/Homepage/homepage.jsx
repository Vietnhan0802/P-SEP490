import React from "react";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import SideBar from "../../components/sidebar";
import Follow from "../../components/follow";
import Post from "../Post/post";
import Blog from "../Blog/blog";
import DashBoard from "../DashBoard/dashBoard";
function Homepage() {
  const [activeComponent, setActiveComponent] = useState("post");

  const handleSidebarItemClick = (itemId) => {
    setActiveComponent(itemId);
  };
  return (
    <div className="bg m-0">
      {activeComponent !== "dashboard" ? (
        <>
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
              {activeComponent === "dashboard" && <DashBoard />}
              {/* Render Blog component when activeComponent is "blog" */}
            </Col>
            <Col md={3}>
              {" "}
              <Follow />
            </Col>
          </Row>
        </>
      ) : (
        <>
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
          </Row>
        </>
      )}
    </div>
  );
}

export default Homepage;
