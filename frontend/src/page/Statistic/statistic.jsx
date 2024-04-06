import React, { useState } from "react";
import "./statistic.scss";
import { VscAccount } from "react-icons/vsc";
import { Col, Row } from "react-bootstrap";
import BarChart from "./barChart";
import { ProjectData } from "./Data/ProjectData";
import { PostData } from "./Data/PostData";
import { BlogData } from "./Data/BlogData";
import { ReportData } from "./Data/ReportData";
import { AccountData } from "./Data/AccountData";
import { AccessData } from "./Data/AccessData";
import SideBar from "../../components/sidebar";
import PieChart from "./PieChart";
import { Line } from "rc-progress";
import LineChart from "./lineChart";
import CardItem from "./CardItem";

function handleDateSort() { }

function Statistic() {
  const [activeTab, setActiveTab] = useState('access');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
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
  // const [activeTab, setActiveTab] = useState("post");
  // const value = 13;
  // const handleTabClick = (tab) => {
  //   setActiveTab(tab);
  // };
  const renderChart = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div style={{ width: "100%" }}>
            <PieChart chartData={accountData} />
          </div>
        );
      case 'post':
        return (
          <div style={{ width: "100%" }}>
            <BarChart chartData={postData} />
          </div>
        );
      case 'blog':
        return (
          <div style={{ width: "100%" }}>
            <BarChart chartData={blogData} />
          </div>
        );
      case 'project':
        return (
          <div style={{ width: "100%" }}>
            <BarChart chartData={projectData} />
          </div>
        );
      case 'report':
        return (
          <div style={{ width: "100%" }}>
            <PieChart chartData={reportData} />
          </div>
        );
      case 'verification':
        return (
          <div style={{ width: "100%" }}>
            <LineChart chartData={accessData} />
          </div>
        );
      default:
        return (
          <div style={{ width: "100%" }}>
            <PieChart chartData={accountData} />
          </div>
        );
    }
  }
  return (
    <Row className="pt-3 ms-0 me-0">
      <Col md={3} >
        <SideBar />
      </Col>
      <Col md={9}>
        <Row>

        </Row>
        <Row>
          <Col md={2} className="px-0">
            <CardItem
              icon={<VscAccount />}
              title="Account"
              count={8}
              active={activeTab === 'account'}
              onClick={() => handleTabClick('account')}
            />
          </Col>
          <Col md={2} className="px-0">
            <CardItem
              icon={<VscAccount />}
              title="Post"
              count={8}
              active={activeTab === 'post'}
              onClick={() => handleTabClick('post')}
            />
          </Col>
          <Col md={2} className="px-0">
            <CardItem
              icon={<VscAccount />}
              title="Blog"
              count={8}
              active={activeTab === 'blog'}
              onClick={() => handleTabClick('blog')}
            />
          </Col>
          <Col md={2} className="px-0">
            <CardItem
              icon={<VscAccount />}
              title="Project"
              count={8}
              active={activeTab === 'project'}
              onClick={() => handleTabClick('project')}
            />
          </Col>
          <Col md={2} className="px-0">
            <CardItem
              icon={<VscAccount />}
              title="Report"
              count={8}
              active={activeTab === 'report'}
              onClick={() => handleTabClick('report')}
            />
          </Col>
          <Col md={2} className="px-0">
            <CardItem
              icon={<VscAccount />}
              title="Verification"
              count={8}
              active={activeTab === 'verification'}
              onClick={() => handleTabClick('verification')}
            />
          </Col>
        </Row>
        <Row>

          <Col md={6}>
            <div className="chart-all bg-white p-3">
              {/* <div style={{ width: "100%" }}>
                <BarChart chartData={projectData} />
              </div>
              <div style={{ width: "100%" }}>
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
              {renderChart()}
            </div>
          </Col>
          <Col md={6}>

            <div className="sup-bar col-auto">
              <div className="d-flex flex-column ">
                <div className="date-filter mb-2 d-flex w-100">
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
              </div>
            </div>
          </Col>
        </Row>

      </Col>

    </Row>
  );
}

export default Statistic;
