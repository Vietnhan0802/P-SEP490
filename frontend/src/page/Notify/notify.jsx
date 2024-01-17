import React from "react";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import SideBar from "../../components/sidebar";
import Follow from "../../components/follow";

function Notify() {
  const [activeComponent, setActiveComponent] = useState("");

  const handleSidebarItemClick = (itemId) => {
    setActiveComponent(itemId);
    // Navigate to the home page ("/home") when the "Profile" item is clicked
    if (
      itemId.toLowerCase() === "post" ||
      itemId.toLowerCase() === "blog" ||
      itemId.toLowerCase() === "own_post" ||
      itemId.toLowerCase() === "own_project" ||
      itemId.toLowerCase() === "project_application" ||
      itemId.toLowerCase() === "verification" ||
      itemId.toLowerCase() === "current_project" ||
      itemId.toLowerCase() === "dashboard"
    ) {
      // Navigate to the home page
      // You might need to adjust the path based on your route configuration
      window.location.href = "/home";
    }
  };
  return (
    <Row className="mx-0 mt-3">
      <Col md={3}>
        <SideBar
          activeItem={activeComponent}
          onItemClick={handleSidebarItemClick}
        />
      </Col>
      <Col md={6}></Col>
      <Col md={3}>
        <Follow />
      </Col>
    </Row>
  );
}

export default Notify;
