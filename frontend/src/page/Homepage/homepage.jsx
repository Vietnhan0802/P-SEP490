import React from "react";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import "./homepage.scss";
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
import Statistic from "../Statistic/statistic";
function Homepage() {
  const [activeComponent, setActiveComponent] = useState("projectDetail");
  const [postId, setPostId] = useState(null);
  const [blogId, setBlogId] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const handleSidebarItemClick = (itemId) => {
    setActiveComponent(itemId);
  };
  const handlePostClick = (postId) => {
    setPostId(postId);
  };
  const handleBlogClick = (blogId) => {
    setBlogId(blogId);
  };
  const hanldeProjectClick = (projectId) => {
    setProjectId(projectId);
  };
  return (
    <div className="bg m-0 ">
      <>
        <Row className="pt-3 ms-0 me-0 bg-sidebar">
          <Col md={3}>
            <SideBar
              activeItem={activeComponent}
              onItemClick={handleSidebarItemClick}
            />
          </Col>
          <Col
            md={`${
              activeComponent === "dashboard" ||
              activeComponent === "projectDetail"||
              activeComponent === "project_application"||
              activeComponent === "statistic"
                ? 9
                : 6
            }`}
          >
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
            {activeComponent === "statistic" && <Statistic />}
            {activeComponent === "projectDetail" && (
              <ProjectDetail id={projectId} />
            )}
            {activeComponent === "own_post" && (
              <OwnPost
                activePost={postId}
                onPostClick={handlePostClick}
                activeItem={activeComponent}
                onItemClick={handleSidebarItemClick}
              />
            )}
            {activeComponent === "own_project" && (
              <OwnProject
                activeProject={projectId}
                onProjectClick={hanldeProjectClick}
                activeItem={activeComponent}
                onItemClick={handleSidebarItemClick}
              />
            )}
            {activeComponent === "project_application" && (
              <ProjectApplication />
            )}
          </Col>
          {activeComponent !== "dashboard" &&
            activeComponent !== "projectDetail" && activeComponent !== "project_application" &&
            activeComponent !== "statistic" && (
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
