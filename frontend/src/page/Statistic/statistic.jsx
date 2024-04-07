import React, { useEffect, useState } from "react";
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
import { staticInstance } from "../../axios/axiosConfig";

function formatDate(dateString) {
  const date = new Date(dateString);
  const month = date.getMonth() + 1; // getMonth() returns zero-based month
  const day = date.getDate();
  const year = date.getFullYear();

  // Pad single digit month and day with leading zero if necessary
  const formattedMonth = month < 10 ? '0' + month : month;
  const formattedDay = day < 10 ? '0' + day : day;

  return formattedMonth + '/' + formattedDay + '/' + year;
}

function Statistic() {
  const [activeTab, setActiveTab] = useState('access');
  const [projectData, setProjectData] = useState();
  const [blogData, setBlogData] = useState();
  const [postData, setPostData] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  const handleClearDates = () => {
    setStartDate(null);
    setEndDate(null);
  };
  useEffect(() => {
    staticInstance.get("CallPostStatistic", { params: { startDate: startDate, endDate: endDate } })
      .then((res) => {
        setPostData({
          labels: res?.data?.result.map((data) => formatDate(data.dateTime)),
          datasets: [
            {
              label: "Number Of Post",
              data: res?.data?.result.map((data) => data.count),
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
        })
      });
    staticInstance.get("CallBlogStatistic", { params: { startDate: startDate, endDate: endDate } })
      .then((res) => {
        setBlogData({
          labels: res?.data?.result.map((data) => formatDate(data.dateTime)),
          datasets: [
            {
              label: "Number Of Post",
              data: res?.data?.result.map((data) => data.count),
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
        })
      });
    staticInstance.get("CallProjectStatistic", { params: { startDate: startDate, endDate: endDate } })
      .then((res) => {
        setProjectData({
          labels: res?.data?.result.map((data) => formatDate(data.dateTime)),
          datasets: [
            {
              label: "Number Of Post",
              data: res?.data?.result.map((data) => data.count),
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
        })
      })
  }, [startDate,endDate])

  useEffect(() => {
    if (startDate > endDate) {
      setStartDate(null);
      setEndDate(null)
    }
  }, [startDate, endDate])
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
              {renderChart()}
            </div>
          </Col>
          <Col md={6}>

            <div className="sup-bar col-auto">
              <div className="d-flex flex-column ">
                <div className="date-filter mb-2 d-flex w-100">
                  <div className="start mb-1">
                    <input type="date" className="form-control" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
                  </div>
                  <div className="end mb-1">
                    <input type="date" className="form-control" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
                  </div>
                  <button className="btn btn-primary" onClick={()=> handleClearDates()}>
                    Clear
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
