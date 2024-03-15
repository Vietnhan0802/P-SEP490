import React from "react";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import "./homepage.scss";
import SideBar from "../../components/sidebar";
import Follow from "../../components/follow";
import Post from "../Post/post";
import Blog from "../Blog/blog";
import DashBoard from "../DashBoard/dashBoard";
import ProjectDetail from "../ProjectDetail/projectDetail";
import OwnPost from "../OwnPost/ownPost";
import OwnProject from "../OwnProject/ownProject";
import ProjectApplication from "../ProjectApplication/projectApplication";
import Project from "../Project/project";
import Statistic from "../Statistic/statistic";
function Homepage() {
  const [activeComponent, setActiveComponent] = useState("post");
  const [projectId, setProjectId] = useState(null);
  const handleSidebarItemClick = (itemId) => {
    setActiveComponent(itemId);
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
            md={`${activeComponent === "dashboard" ||
              activeComponent === "projectDetail" ||
              activeComponent === "project_application" ||
              activeComponent === "statistic"
              ? 9
              : 6
              }`}
          >
            {activeComponent === "post" && (<Post />)}
            {activeComponent === "blog" && (<Blog />)}
            {activeComponent === "project" && <Project
              activeProject={projectId}
              onProjectClick={hanldeProjectClick}
              activeItem={activeComponent}
              onItemClick={handleSidebarItemClick} />}
            {activeComponent === "dashboard" && <DashBoard />}
            {activeComponent === "statistic" && <Statistic />}
            {activeComponent === "projectDetail" && (
              <ProjectDetail id={projectId} />
            )}
            {activeComponent === "own_post" && (
              <OwnPost
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
            activeComponent !== "projectDetail" && 
            activeComponent !== "project_application" &&
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
