import React from "react";
import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import "./dashBoard.scss";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { MdFullscreen } from "react-icons/md";
import PostTable from "./DashboardTable/PostTable";
import BlogTable from "./DashboardTable/BlogTable";
import AccessTable from "./DashboardTable/AccessTable";
import ReportTable from "./DashboardTable/ReportTable";
function DashBoard() {
  const [activeTab, setActiveTab] = useState("post");
  const value = 13;
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const renderTable = () => {
    switch (activeTab) {
      case "post":
        return <PostTable />;
      case "blog":
        return <BlogTable />;
      case "access":
        return <AccessTable />;
      case "report":
        return <ReportTable />;
      default:
        return null;
    }
  };
  return (
    <div id="dashboard">
      <Row>
        <Col md={9}>
          <Row className="bg-white cover">
            <Col md={6} className="px-0">
              <div
                className={`card m-1 bg-white p-2 ${
                  activeTab === "post" ? "active-tab" : ""
                }`}
              >
                <div className="mb-1 fs-12">Manage Post</div>
                <div className="d-flex justify-content-between">
                  <p className="fs-24 fw-bold">63 New Post</p>
                  <p className="rounded-pill percent fw-bold d-flex justify-content-center align-items-center">
                    12%
                  </p>
                </div>
                <hr style={{ margin: "0.5rem 0" }} />
                <p
                  className="d-flex justify-content-end mt-2 detail"
                  onClick={() => handleTabClick("post")}
                >
                  {
                    activeTab === "post" ? "Viewing" : "View Detail"
                  }                </p>
              </div>
            </Col>
            <Col md={6} className="px-0">
              <div  className={`card m-1 bg-white p-2 ${
                  activeTab === "access" ? "active-tab" : ""
                }`}>
                <div className="mb-1 fs-12">Manage Access</div>
                <div className="d-flex justify-content-between">
                  <p className="fs-24 fw-bold">63 Accesses</p>
                  <p className="rounded-pill percent fw-bold d-flex justify-content-center align-items-center">
                    8%
                  </p>
                </div>
                <hr style={{ margin: "0.5rem 0" }} />
                <p
                  className="d-flex justify-content-end mt-2 detail"
                  onClick={() => handleTabClick("access")}
                >
                                   {
                    activeTab === "access" ? "Viewing" : "View Detail"
                  }   
                </p>
              </div>
            </Col>
            <Col md={6} className="px-0">
              <div  className={`card m-1 bg-white p-2 ${
                  activeTab === "blog" ? "active-tab" : ""
                }`}>
                <div className="mb-1 fs-12">Manage Blog</div>
                <div className="d-flex justify-content-between">
                  <p className="fs-24 fw-bold">63 New Blog</p>
                  <p className="rounded-pill percent fw-bold d-flex justify-content-center align-items-center">
                    12%
                  </p>
                </div>
                <hr style={{ margin: "0.5rem 0" }} />
                <p
                  className="d-flex justify-content-end mt-2 detail"
                  onClick={() => handleTabClick("blog")}
                >
                                   {
                    activeTab === "blog" ? "Viewing" : "View Detail"
                  }   
                </p>
              </div>
            </Col>
            <Col md={6} className="px-0">
              <div  className={`card m-1 bg-white p-2 ${
                  activeTab === "report" ? "active-tab" : ""
                }`}>
                <div className="mb-1 fs-12">Manage Report</div>
                <div className="d-flex justify-content-between">
                  <p className="fs-24 fw-bold">63 New Reports</p>
                  <p className="rounded-pill percent fw-bold d-flex justify-content-center align-items-center">
                    12%
                  </p>
                </div>
                <hr style={{ margin: "0.5rem 0" }} />
                <p
                  className="d-flex justify-content-end mt-2 detail"
                  onClick={() => handleTabClick("report")}
                >
                                   {
                    activeTab === "report" ? "Viewing" : "View Detail"
                  }   
                </p>
              </div>
            </Col>
          </Row>
        </Col>
        <Col md={3}>
          <div className="cover my-0 h-100">
            <p className="text-center fw-bold fs-20">Manage Verification</p>
            <div className=" d-flex justify-content-center mt-3">
              <div
                style={{ width: 170 }}
                className="d-flex justify-content-center "
              >
                <CircularProgressbar
                  className="w-75"
                  value={value}
                  maxValue={16}
                  text={`${value}`}
                  styles={buildStyles({
                    // Rotation of path and trail, in number of turns (0-1)
                    // rotation: 0.25,

                    // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                    strokeLinecap: "round",

                    // Text size
                    textSize: "35px",

                    // How long animation takes to go from one percentage to another, in seconds
                    pathTransitionDuration: 0.5,

                    // Can specify path transition in more detail, or remove it entirely
                    // pathTransition: 'none',

                    // Colors
                    pathColor: `#2F45ADCC`,
                    textColor: "#000",
                    trailColor: "#BBC7F6",
                    backgroundColor: "#3e98c7",
                  })}
                />
                ;
              </div>
            </div>

            <p className="text-center my-2  ">Not processed yet</p>
            <div className="verification  d-flex justify-content-center">
              <div className="mt-2 d-flex align-items-center justify-content-center detail">
                <MdFullscreen className="me-2 fs-30" /> <p>View Detail</p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      <Row className="ps-0">{renderTable()}</Row>
    </div>
  );
}
export default DashBoard;
