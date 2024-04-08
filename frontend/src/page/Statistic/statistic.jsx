import React, { useEffect, useState } from "react";
import "./statistic.scss";
import { VscAccount } from "react-icons/vsc";
import { Col, Row } from "react-bootstrap";
import BarChart from "./barChart";
import { GoPencil } from "react-icons/go";
import { FiBookOpen } from "react-icons/fi";
import { LuBook } from "react-icons/lu";
import { MdVerified } from 'react-icons/md';
import { TbMessageReport } from "react-icons/tb";
import Dropdown from 'react-bootstrap/Dropdown';
import { MdBarChart } from "react-icons/md";
import { ReportData } from "./Data/ReportData";
import { AccountData } from "./Data/AccountData";
import { AccessData } from "./Data/AccessData";
import SideBar from "../../components/sidebar";
import PieChart from "./PieChart";
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
  const [statisticPostType, setStatisticPostType] = useState('today');
  const [statisticBlogType, setStatisticBlogType] = useState('today');
  const [statisticProjectType, setStatisticProjectType] = useState('today');
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  useEffect(() => {
    staticInstance.get(`CallPostStatistic/${statisticPostType}`)
      .then((res) => {
        setPostData({
          labels: res?.data?.result.map((data) => {
            if (statisticPostType === 'today') {
              return data.hourInDay
            } else if ((statisticPostType === 'week')) {
              return data.dayInWeek;
            } else if (statisticPostType === 'month') {
              return formatDate(data.dayInMonth)
            } else {
              return data.monthInYear
            }
          }),
          datasets: [
            {
              label: "Number Of Post",
              data: res?.data?.result.map((data) => data.count),
              backgroundColor: [
                "rgba(75,192,192,0.2)"
              ],
              borderWidth: 1,
            },
          ],
        })
      });

  }, [statisticPostType])
  useEffect(() => {
    staticInstance.get(`CallBlogStatistic/${statisticBlogType}`)
      .then((res) => {
        setBlogData({
          labels: res?.data?.result.map((data) => {
            if (statisticBlogType === 'today') {
              return data.hourInDay
            } else if ((statisticBlogType === 'week')) {
              return data.dayInWeek;
            } else if (statisticBlogType === 'month') {
              return formatDate(data.dayInMonth)
            } else {
              return data.monthInYear
            }
          }
          ),
          datasets: [
            {
              label: "Number Of Blog",
              data: res?.data?.result.map((data) => data.count),
              backgroundColor: [
                "rgba(75,192,192,0.2)"
              ],
              borderWidth: 1,
            },
          ],
        })
      });

  }, [statisticBlogType])
  useEffect(() => {
    staticInstance.get(`CallProjectStatistic/${statisticProjectType}`)
      .then((res) => {
        setProjectData({
          labels: res?.data?.result.map((data) => {
            if (statisticProjectType === 'today') {
              return data.hourInDay
            } else if ((statisticProjectType === 'week')) {
              return data.dayInWeek;
            } else if (statisticProjectType === 'month') {
              return formatDate(data.dayInMonth)
            } else {
              return data.monthInYear
            }
          }),
          datasets: [
            {
              label: "Number Of Project",
              data: res?.data?.result.map((data) => data.count),
              backgroundColor: [
                "rgba(75,192,192,0.2)"
              ],
              borderWidth: 1,
            },
          ],
        })
      })
  }, [statisticProjectType])

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
          "rgba(75,192,192,0.2)",
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
            <div>
              <Col md={8} className="position-relative pt-3" >
                <div className="position-absolute top-0 end-0">
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="white"
                      className="border-none text-body">
                      <MdBarChart size={14} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={{ minWidth: 'auto' }}>
                      <Dropdown.Item onClick={() => setStatisticPostType('today')}>Today</Dropdown.Item>
                      <Dropdown.Item onClick={() => setStatisticPostType('week')}>Week</Dropdown.Item>
                      <Dropdown.Item onClick={() => setStatisticPostType('month')}>Month</Dropdown.Item>
                      <Dropdown.Item onClick={() => setStatisticPostType('year')}>Year</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <BarChart chartData={postData} />
              </Col>
            </div>
          </div>
        );
      case 'blog':
        return (
          <div style={{ width: "100%" }}>
            <div >

              <Col md={8} className="position-relative pt-3">
                <div className="position-absolute top-0 end-0">
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="white"
                      className="border-none text-body">
                      <MdBarChart size={14} />
                    </Dropdown.Toggle>

                    <Dropdown.Menu style={{ minWidth: 'auto' }}>
                      <Dropdown.Item onClick={() => setStatisticBlogType('today')}>Today</Dropdown.Item>
                      <Dropdown.Item onClick={() => setStatisticBlogType('week')}>Week</Dropdown.Item>
                      <Dropdown.Item onClick={() => setStatisticBlogType('month')}>Month</Dropdown.Item>
                      <Dropdown.Item onClick={() => setStatisticBlogType('year')}>Year</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <BarChart chartData={blogData} />
              </Col>
            </div>
          </div>
        );
      case 'project':
        return (
          <div style={{ width: "100%" }}>
            <div className="d-flex">
              <Col md={8} className="position-relative pt-3">
                <div className="position-absolute top-0 end-0">
                  <Dropdown>
                    <Dropdown.Toggle
                      variant="white"
                      className="border-none text-body">
                      <MdBarChart size={14} />
                    </Dropdown.Toggle>

                    <Dropdown.Menu style={{ minWidth: 'auto' }}>
                      <Dropdown.Item onClick={() => setStatisticProjectType('today')}>Today</Dropdown.Item>
                      <Dropdown.Item onClick={() => setStatisticProjectType('week')}>Week</Dropdown.Item>
                      <Dropdown.Item onClick={() => setStatisticProjectType('month')}>Month</Dropdown.Item>
                      <Dropdown.Item onClick={() => setStatisticProjectType('year')}>Year</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <BarChart chartData={projectData} />
              </Col>
              <Col md={4}>
                <PieChart chartData={reportData} />
              </Col>
            </div>

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
          <Col md={4} className="px-0">
            <CardItem
              icon={<VscAccount />}
              title="Account"
              count={8}
              active={activeTab === 'account'}
              onClick={() => handleTabClick('account')}
            />
          </Col>
          <Col md={4} className="px-0">
            <CardItem
              icon={<VscAccount />}
              title="Post"
              count={8}
              active={activeTab === 'post'}
              onClick={() => handleTabClick('post')}
            />
          </Col>
          <Col md={4} className="px-0">
            <CardItem
              icon={<VscAccount />}
              title="Blog"
              count={8}
              active={activeTab === 'blog'}
              onClick={() => handleTabClick('blog')}
            />
          </Col>
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
              icon={<GoPencil />}
              title="Post"
              count={8}
              active={activeTab === 'post'}
              onClick={() => handleTabClick('post')}
            />
          </Col>
          <Col md={2} className="px-0">
            <CardItem
              icon={<FiBookOpen />}
              title="Blog"
              count={8}
              active={activeTab === 'blog'}
              onClick={() => handleTabClick('blog')}
            />
          </Col>
          <Col md={2} className="px-0">
            <CardItem
              icon={<LuBook />}
              title="Project"
              count={8}
              active={activeTab === 'project'}
              onClick={() => handleTabClick('project')}
            />
          </Col>
          <Col md={2} className="px-0">
            <CardItem
              icon={<TbMessageReport />}
              title="Report"
              count={8}
              active={activeTab === 'report'}
              onClick={() => handleTabClick('report')}
            />
          </Col>
          <Col md={2} className="px-0">
            <CardItem
              icon={<MdVerified />}
              title="Verification"
              count={8}
              active={activeTab === 'verification'}
              onClick={() => handleTabClick('verification')}
            />
          </Col>
        </Row>
        <Row className="ms-0 me-0">
          <div className="bg-white">
            {renderChart()}
          </div>
          {/* <Col md={6}>

            <div className="sup-bar col-auto">
              <div className="d-flex flex-column ">
                <div className="date-filter mb-2 d-flex w-100">
                  <div className="start mb-1">
                    <input type="date" className="form-control" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
                  </div>
                  <div className="end mb-1">
                    <input type="date" className="form-control" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
                  </div>
                  <button className="btn btn-primary" onClick={() => handleClearDates()}>
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </Col> */}
        </Row>

      </Col>

    </Row>
  );
}

export default Statistic;
