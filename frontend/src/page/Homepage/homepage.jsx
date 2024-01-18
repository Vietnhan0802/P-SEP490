import React from "react";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import SideBar from "../../components/sidebar";
import Follow from "../../components/follow";
import Post from "../Post/post";
import Blog from "../Blog/blog";
import DashBoard from "../DashBoard/dashBoard";
import PostDetail from "../Detail/postDetail";
function Homepage() {
  const [activeComponent, setActiveComponent] = useState("post");
  const [postId, setPostId] = useState(null);
  const handleSidebarItemClick = (itemId) => {
    setActiveComponent(itemId);
  };
  const handlePostClick = (postId) => {
    setPostId(postId);
    console.log(postId);
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
              {activeComponent === "post" && (
                <Post activePost={postId} onPostClick={handlePostClick} activeItem={activeComponent} onItemClick={handleSidebarItemClick}/>
              )}
              {activeComponent === "blog" && <Blog />}
              {activeComponent === "dashboard" && <DashBoard />}
              {activeComponent === "post_detail" && <PostDetail id={postId}/>}
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
