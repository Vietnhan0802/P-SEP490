import React, { useState } from "react";
import "./statistic.scss";
import { CiCircleChevRight } from "react-icons/ci";
import { GoPencil } from "react-icons/go";
import { FiBookOpen } from "react-icons/fi";
import { Row, Col } from "react-bootstrap";
import FormDate from "./formDate";
import BarChart from "./barChart";
import { ProjectData } from "./ProjectData";
import { PostData } from "./PostData";
import { BlogData } from "./BlogData";
import { ReportData } from "./ReportData";
import { AccountData } from "./AccountData";
import { AccessData } from "./AccessData";
import LineChart from "./lineChart";
import { Bar } from "react-chartjs-2";
import PieChart from "./PieChart";

import TempAvatar from "../../images/common/Avatar.png";

function handleDateSort() {}

function Statistic() {
  const [projectData, setProjectData] = useState({
    labels: ProjectData.map((data) => data.date),
    datasets: [
      {
        label: "Number Of Project",
        data: ProjectData.map((data) => data.count),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 1,
      },
    ],
  });
  const [postData, setPostData] = useState({
    labels: PostData.map((data) => data.date),
    datasets: [
      {
        label: "Number Of Post",
        data: PostData.map((data) => data.count),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 1,
      },
    ],
  });
  const [blogData, setBlogData] = useState({
    labels: BlogData.map((data) => data.date),
    datasets: [
      {
        label: "Number Of Blog",
        data: BlogData.map((data) => data.count),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 1,
      },
    ],
  });
  const [reportData, setReportData] = useState({
    labels: ReportData.map((data) => data.type),
    datasets: [
      {
        label: "Number Of Report",
        data: ReportData.map((data) => data.count),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 1,
      },
    ],
  });
  const [accountData, setAccountData] = useState({
    labels: AccountData.map((data) => data.type),
    datasets: [
      {
        label: "Number Of Report",
        data: AccountData.map((data) => data.count),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 1,
      },
    ],
  });
  const [accessData, setAccessData] = useState({
    labels: AccessData.map((data) => data.date),
    datasets: [
      {
        label: "New Accout",
        data: AccessData.map((data) => data.count),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0",
        ],
        borderColor: "black",
        borderWidth: 1,
      },
    ],
  });
  const [activeTab, setActiveTab] = useState("post");
  const value = 13;
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  return (
    <section id="sta-page" className="size-20">
      <div className="card-section row ">
        <Col md={4} className="px-0">
          <div
            className={`card  bg-white p-2 m-2 mt-0 ${
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
              className="d-flex justify-content-end  detail"
              onClick={() => handleTabClick("post")}
            >
              {activeTab === "post" ? "Viewing" : "View Detail"}{" "}
            </p>
          </div>
        </Col>
        <Col md={4} className="px-0">
          <div
            className={`card  bg-white p-2 m-2 mt-0 ${
              activeTab === "access" ? "active-tab" : ""
            }`}
          >
            <div className="mb-1 fs-12">Manage Access</div>
            <div className="d-flex justify-content-between">
              <p className="fs-24 fw-bold">63 Accesses</p>
              <p className="rounded-pill percent fw-bold d-flex justify-content-center align-items-center">
                8%
              </p>
            </div>
            <hr style={{ margin: "0.5rem 0" }} />
            <p
              className="d-flex justify-content-end  detail"
              onClick={() => handleTabClick("access")}
            >
              {activeTab === "access" ? "Viewing" : "View Detail"}
            </p>
          </div>
        </Col>
        <Col md={4} className="px-0">
          <div
            className={`card  bg-white p-2 m-2 mt-0 ${
              activeTab === "blog" ? "active-tab" : ""
            }`}
          >
            <div className="mb-1 fs-12">Manage Blog</div>
            <div className="d-flex justify-content-between">
              <p className="fs-24 fw-bold">63 New Blog</p>
              <p className="rounded-pill percent fw-bold d-flex justify-content-center align-items-center">
                12%
              </p>
            </div>
            <hr style={{ margin: "0.5rem 0" }} />
            <p
              className="d-flex justify-content-end  detail"
              onClick={() => handleTabClick("blog")}
            >
              {activeTab === "blog" ? "Viewing" : "View Detail"}
            </p>
          </div>
        </Col>
        <Col md={4} className="px-0">
          <div
            className={`card  bg-white p-2 m-2 mt-0 ${
              activeTab === "report" ? "active-tab" : ""
            }`}
          >
            <div className="mb-1 fs-12">Manage Report</div>
            <div className="d-flex justify-content-between">
              <p className="fs-24 fw-bold">63 New Reports</p>
              <p className="rounded-pill percent fw-bold d-flex justify-content-center align-items-center">
                12%
              </p>
            </div>
            <hr style={{ margin: "0.5rem 0" }} />
            <p
              className="d-flex justify-content-end  detail"
              onClick={() => handleTabClick("report")}
            >
              {activeTab === "report" ? "Viewing" : "View Detail"}
            </p>
          </div>
        </Col>
        <Col md={4} className="px-0">
          <div
            className={`card  bg-white p-2 m-2 mt-0 ${
              activeTab === "project" ? "active-tab" : ""
            }`}
          >
            <div className="mb-1 fs-12">Manage Project</div>
            <div className="d-flex justify-content-between">
              <p className="fs-24 fw-bold">63 New Project</p>
              <p className="rounded-pill percent fw-bold d-flex justify-content-center align-items-center">
                12%
              </p>
            </div>
            <hr style={{ margin: "0.5rem 0" }} />
            <p
              className="d-flex justify-content-end  detail"
              onClick={() => handleTabClick("Project")}
            >
              {activeTab === "Project" ? "Viewing" : "View Detail"}
            </p>
          </div>
        </Col>
        <Col md={4} className="px-0">
          <div
            className={`card  bg-white p-2 m-2 mt-0 ${
              activeTab === "report" ? "active-tab" : ""
            }`}
          >
            <div className="mb-1 fs-12">Manage Account</div>
            <div className="d-flex justify-content-between">
              <p className="fs-24 fw-bold">63 Account in System</p>
              <p className="rounded-pill percent fw-bold d-flex justify-content-center align-items-center">
                12%
              </p>
            </div>
            <hr style={{ margin: "0.5rem 0" }} />
            <p
              className="d-flex justify-content-end  detail"
              onClick={() => handleTabClick("report")}
            >
              {activeTab === "report" ? "Viewing" : "View Detail"}
            </p>
          </div>
        </Col>
      </div>
      <div className="chart-section d-flex flex-grid row">
        <div className="chart-all col">
          <div style={{ width: "100%" }}>
            <BarChart chartData={projectData} />
          </div>
          {/* <div style={{ width: "100%" }}>
                <BarChart chartData={postData} />
              </div>
              <div style={{ width: "100%" }}>
                <BarChart chartData={blogData} />
              </div>
              <div style={{ width: "100%" }}>
                <PieChart chartData={reportData} />
              </div>
              <div style={{ width: "100%" }}>
                <PieChart chartData={accountData} />
              </div>
              <div style={{ width: "100%" }}>
                <LineChart chartData={accessData} />
              </div> */}
        </div>

        <div className="sup-bar col-auto">
          <div className="d-flex flex-column ">
            <div className="date-filter mb-2">
              <div className="start mb-1">
                <input type="date" className="form-control" />
              </div>
              <div className="end mb-1">
                <input type="date" className="form-control" />
              </div>
              <button className="btn btn-primary" onClick={handleDateSort}>
                Submit
              </button>
            </div>

            <div className="" id="content-for-post">
              <div className="card h-100 w-100 m-0">
                <div className="mb-2 fs-12">Most popular POST </div>
                <div className="row align-items-center">
                  <div className="avata-contain col-2 d-flex align-items-center justify-content-center">
                    <img src={TempAvatar} className="avata" alt="Avatar" />
                  </div>
                  <div className="descript p-0 row flex-column col-10">
                    <p className="title ellipsis fw-bold ">
                      Post Title aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
                    </p>
                    <p className="account ellipsis">
                      ACcount Name aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Statistic;
