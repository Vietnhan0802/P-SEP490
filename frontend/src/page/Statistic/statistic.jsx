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
import { ReportData } from "./ReportData";
import { AccountData } from "./AccountData";
import { AccessData } from "./AccessData";
import LineChart from "./lineChart";
import { Bar } from "react-chartjs-2";
import PieChart from "./PpeChart";

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
      <div className="row">
        <div className="main-content col-9">
          <div className="card-section row p-2">
            <FormDate />
          </div>
          <div className="chart row">
            <div style={{ width: "100%" }}>
              <BarChart chartData={projectData} />
            </div>
            <div style={{ width: "100%" }}>
              <BarChart chartData={postData} />
            </div>
            <div style={{ width: "100%" }}>
              <PieChart chartData={reportData} />
            </div>
            <div style={{ width: "100%" }}>
              <PieChart chartData={accountData} />
            </div>
            <div style={{ width: "100%" }}>
              <LineChart chartData={accessData} />
            </div>
          </div>
        </div>
        <div className="sup-bar col-3">
          <div className="row">
            <Col md={12} className="px-0">
              <div
                className={`card  bg-white p-2 ${
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
            <Col md={12} className="px-0">
              <div
                className={`card  bg-white p-2 ${
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
            <Col md={12} className="px-0">
              <div
                className={`card  bg-white p-2 ${
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
            <Col md={12} className="px-0">
              <div
                className={`card  bg-white p-2 ${
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

            <Col md={12} className="px-0">
              <div
                className={`card  bg-white p-2 ${
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
          </div>
        </div>
      </div>
    </section>
  );
}

export default Statistic;
