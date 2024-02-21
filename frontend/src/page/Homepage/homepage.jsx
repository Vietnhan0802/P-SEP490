import React from "react";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import SideBar from "../../components/sidebar";
import Follow from "../../components/follow";
import Post from "../Post/post";
import Blog from "../Blog/blog";
import DashBoard from "../DashBoard/dashBoard";
import PostDetail from "../Detail/postDetail";
import BlogDetail from "../Detail/blogDetail";
import ProjectDetail from "../ProjectDetail/projectDetail";
import OwnPost from "../OwnPost/ownPost";
import OwnProject from "../OwnProject/ownProject";
import ProjectApplication from "../ProjectApplication/projectApplication";
function Homepage() {
  const [activeComponent, setActiveComponent] = useState("post");
  const [postId, setPostId] = useState(null);
  const [blogId, setBlogId] = useState(null);
  const handleSidebarItemClick = (itemId) => {
    setActiveComponent(itemId);
  };
  const handlePostClick = (postId) => {
    setPostId(postId);
  };
  const handleBlogClick = (blogId) => {
    setBlogId(blogId);
  };
  return (
    <div className="bg m-0">

      <>
        <Row className="mt-3 ms-0 me-0">
          <Col md={3}>
            <SideBar
              activeItem={activeComponent}
              onItemClick={handleSidebarItemClick}
            />
          </Col>
          <Col md={`${activeComponent === 'dashboard' || activeComponent === 'projectDetail' ? 9 : 6}`}>
            {activeComponent === "post" && (
              <Post
                activePost={postId}
                onPostClick={handlePostClick}
                activeItem={activeComponent}
                onItemClick={handleSidebarItemClick}
              />
            )}
            {activeComponent === "blog" && (
              <Blog
                activeBlog={postId}
                onBlogClick={handleBlogClick}
                activeItem={activeComponent}
                onItemClick={handleSidebarItemClick}
              />
            )}
            {activeComponent === "post_detail" && <PostDetail id={postId} />}
            {activeComponent === "blog_detail" && <BlogDetail id={blogId} />}
            {activeComponent === "dashboard" && <DashBoard />}
            {activeComponent === "projectDetail" && <ProjectDetail />}
            {activeComponent === "own_post" && <OwnPost />}
            {activeComponent === "own_project" && <OwnProject />}
            {activeComponent === "project_application" && <ProjectApplication />}
          </Col>
          {(activeComponent !== "dashboard" && activeComponent !== "projectDetail"
          ) && (
              <Col md={3}>
                <Follow />
              </Col>
            )}
        </Row>
      </>

    </div>
  );
}

export default Homepage;
