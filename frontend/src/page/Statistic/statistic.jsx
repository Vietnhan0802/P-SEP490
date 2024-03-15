import React, { useState } from "react";
import "./statistic.scss";
import { GoPencil } from "react-icons/go";
import { VscAccount } from "react-icons/vsc";
import { LuBook } from "react-icons/lu";
import { VscReport } from "react-icons/vsc";
import { FiBookOpen } from "react-icons/fi";
import { Col, Row } from "react-bootstrap";
import { TbPresentationAnalytics } from "react-icons/tb";

import { SlChart } from "react-icons/sl";
import { FaRegCircleCheck } from "react-icons/fa6";
import BarChart from "./barChart";
import { ProjectData } from "./Data/ProjectData";
import { PostData } from "./Data/PostData";
import { BlogData } from "./Data/BlogData";
import { ReportData } from "./Data/ReportData";
import { AccountData } from "./Data/AccountData";
import { AccessData } from "./Data/AccessData";
import SideBar from "../../components/sidebar";

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
    <Row className="pt-3 ms-0 me-0">
    <Col md={3} >
      <SideBar />
    </Col>
    <Col md={9}>
    <section id="sta-page" className="size-20">
      <div className="card-section row ">
        <Col md={2} className="px-0">
          <div
            className={`card  bg-white p-2 m-2 mt-0 ${
              activeTab === "access" ? "active-tab" : ""
            }`}
          >
            <div className="mb-1 fs-12">ACCOUNT Created </div>
            <div className="d-flex justify-content-between align-items-center">
              <VscAccount />
              <p className="rounded-pill percent fw-bold d-flex justify-content-center align-items-center">
                8
              </p>
            </div>
            <hr style={{ margin: "0.5rem 0" }} />
            <p
              className="d-flex justify-content-end  detail"
              onClick={() => handleTabClick("access")}
            >
              {activeTab === "access" ? (
                <TbPresentationAnalytics />
              ) : (
                <SlChart />
              )}
            </p>
          </div>
        </Col>
        <Col md={2} className="px-0">
          <div
            className={`card  bg-white p-2 m-2 mt-0 ${
              activeTab === "post" ? "active-tab" : ""
            }`}
          >
            <div className="mb-1 fs-12">POST Created </div>
            <div className="d-flex justify-content-between align-items-center">
              <GoPencil />
              <p className="rounded-pill percent fw-bold d-flex justify-content-center align-items-center">
                12
              </p>
            </div>
            <hr style={{ margin: "0.5rem 0" }} />
            <p
              className="d-flex justify-content-end  detail"
              onClick={() => handleTabClick("post")}
            >
              {activeTab === "post" ? <TbPresentationAnalytics /> : <SlChart />}{" "}
            </p>
          </div>
        </Col>

        <Col md={2} className="px-0">
          <div
            className={`card  bg-white p-2 m-2 mt-0 ${
              activeTab === "blog" ? "active-tab" : ""
            }`}
          >
            <div className="mb-1 fs-12">BLOG Created</div>
            <div className="d-flex justify-content-between align-items-center">
              <FiBookOpen />
              <p className="rounded-pill percent fw-bold d-flex justify-content-center align-items-center">
                12
              </p>
            </div>
            <hr style={{ margin: "0.5rem 0" }} />
            <p
              className="d-flex justify-content-end  detail"
              onClick={() => handleTabClick("blog")}
            >
              {activeTab === "blog" ? <TbPresentationAnalytics /> : <SlChart />}
            </p>
          </div>
        </Col>
        <Col md={2} className="px-0">
          <div
            className={`card  bg-white p-2 m-2 mt-0 ${
              activeTab === "report" ? "active-tab" : ""
            }`}
          >
            <div className="mb-1 fs-12">REPORT Created</div>
            <div className="d-flex justify-content-between align-items-center">
              <VscReport />
              <p className="rounded-pill percent fw-bold d-flex justify-content-center align-items-center">
                12
              </p>
            </div>
            <hr style={{ margin: "0.5rem 0" }} />
            <p
              className="d-flex justify-content-end  detail"
              onClick={() => handleTabClick("report")}
            >
              {activeTab === "report" ? (
                <TbPresentationAnalytics />
              ) : (
                <SlChart />
              )}
            </p>
          </div>
        </Col>
        <Col md={2} className="px-0">
          <div
            className={`card  bg-white p-2 m-2 mt-0 ${
              activeTab === "project" ? "active-tab" : ""
            }`}
          >
            <div className="mb-1 fs-12">PROJECT Created</div>
            <div className="d-flex justify-content-between align-items-center">
              <LuBook />
              <p className="rounded-pill percent fw-bold d-flex justify-content-center align-items-center">
                12
              </p>
            </div>
            <hr style={{ margin: "0.5rem 0" }} />
            <p
              className="d-flex justify-content-end  detail"
              onClick={() => handleTabClick("Project")}
            >
              {activeTab === "Project" ? (
                <TbPresentationAnalytics />
              ) : (
                <SlChart />
              )}
            </p>
          </div>
        </Col>
        <Col md={2} className="px-0">
          <div
            className={`card  bg-white p-2 m-2 mt-0 ${
              activeTab === "verification" ? "active-tab" : ""
            }`}
          >
            <div className="mb-1 fs-12">VERIFICATION</div>
            <div className="d-flex justify-content-between align-items-center">
              <FaRegCircleCheck />
              <p className="rounded-pill percent fw-bold d-flex justify-content-center align-items-center">
                12
              </p>
            </div>
            <hr style={{ margin: "0.5rem 0" }} />
            <p
              className="d-flex justify-content-end  detail"
              onClick={() => handleTabClick("verification")}
            >
              {activeTab === "verification" ? (
                <TbPresentationAnalytics />
              ) : (
                <SlChart />
              )}
            </p>
          </div>
        </Col>
      </div>
      <div className="chart-section ">
        <div className="chart-all p-3">
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

        {/* <div className="sup-bar col-auto">
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
        </div> */}
      </div>
    </section>
    </Col>

</Row>
  );
}

export default Statistic;
