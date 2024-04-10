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
import SideBar from "../../components/sidebar";
import PieChart from "./PieChart";
import CardItem from "./CardItem";
import { blogInstance, postInstance, staticInstance } from "../../axios/axiosConfig";
import { Rating } from "react-simple-star-rating";
import defaultImage from '../../images/common/images-empty.png'
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
const createData = (
  id,
  createdDate,
  avatar,
  title,
  content,
  view,
  like,
  viewPostImages,
  fullName,
  isLike,
  isVerified
) => {
  return {
    id,
    createdDate,
    avatar,
    title,
    content,
    view,
    like,
    viewPostImages,
    fullName,
    isLike,
    isVerified
  };
};
function Statistic({color}) {
  const sessionData = JSON.parse(sessionStorage.getItem("userSession")) || {};
  const { role, currentUserId } = sessionData;
  const [theme, setTheme] = useState(true);

  const [postListTrend, setPostListTrend] = useState([]);
  const [blogListTrend, setBlogListTrend] = useState([]);

  const [activeTab, setActiveTab] = useState('account');
  const [projectData, setProjectData] = useState();
  const [blogData, setBlogData] = useState();
  const [postData, setPostData] = useState();
  const [reportData, setReportData] = useState();
  const [accountData, setAccountData] = useState();
  const [verifyData, setVerifyData] = useState();

  const [projectStatus, setProjectstatus] = useState([]);
  const [accountStatus, setAccountStatus] = useState([]);
  const [reportStatus, setReportStatus] = useState([]);
  const [verifyStatus, setVerifyStatus] = useState([]);

  const [topFreelancer, setTopFreelancer] = useState([]);
  const [topBusiness, setTopBusiness] = useState([]);
  const [topProject, setTopProject] = useState([]);

  const [statisticPostType, setStatisticPostType] = useState('today');
  const [statisticBlogType, setStatisticBlogType] = useState('today');
  const [statisticProjectType, setStatisticProjectType] = useState('today');
  const [statisticAccountType, setStatisticAccountType] = useState('today');
  const [statisticReportType, setStatisticReportType] = useState('today');
  const [statisticVerificationType, setStatisticVerificationType] = useState('today');

  useEffect(() => {
    const selectedTheme = localStorage.getItem("selectedTheme");
    console.log(selectedTheme)
  }, [color])
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  useEffect(() => {
    staticInstance.get(`GetTop3Freelancer`)
      .then((res) => {
        setTopFreelancer(res?.data?.result);
      }).catch((error) => console.error(error));
    staticInstance.get(`GetTop3Business`)
      .then((res) => {
        setTopBusiness(res?.data?.result);
      }).catch((error) => console.error(error));
    staticInstance.get(`GetTop3Project`)
      .then((res) => {
        setTopProject(res?.data?.result);
      })
      .catch((error) => console.error(error));
    ;
  }, [])
  useEffect(() => {
    staticInstance.get(`/CallPostStatistic/${statisticPostType}`)
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
              label: 'Number of post',
              data: res?.data?.result.map((data) => data.count),
              backgroundColor: [
                "rgba(75,192,192,0.2)"
              ],
              borderWidth: 1,
            },
          ],
        })
      });
    postInstance.get(`GetAllPostsTrend/${currentUserId}`)
      .then((res) => {
        const postList = res?.data?.result;
        setPostListTrend([]);
        postList.map((element) => {
          const time = formatDate(element.createdDate);
          setPostListTrend((prevData) => [
            ...prevData,
            createData(
              element.idPost,
              time,
              element.avatar,
              element.title,
              element.content,
              element.viewInDate,
              element.like,
              element.viewPostImages,
              element.fullName,
              element.isLike,
              element.isVerified
            ),
          ]);
        });
      })
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
    blogInstance
      .get(`GetAllBlogsTrend/${currentUserId}`)
      .then((res) => {
        const blogList = res?.data?.result;
        setBlogListTrend([]);
        blogList.map((element) => {
          const time = formatDate(element.createdDate);
          setBlogListTrend((prevData) => [
            ...prevData,
            createData(
              element.idBlog,
              element.avatar,
              time,
              element.title,
              element.content,
              element.viewInDate,
              element.like,
              element.viewBlogImages,
              element.fullName,
              element.isLike
            ),
          ]);
        });
      })
      .catch((error) => {
        console.error(error);
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
    staticInstance.get(`GetAllProcessProjectInsystem`)
      .then((res) => {
        setProjectstatus({
          labels: res?.data?.result.map((data) => data.type),
          datasets: [
            {
              label: "Project Status",
              data: res?.data?.result.map((data) => data.count),
              backgroundColor: [
                "rgba(75,192,192,0.2)",
                "#ecf0f1",
                "#50AF95",
                "#f3ba2f",
                "#2a71d0",
              ],
              borderWidth: 1,
            },
          ],
        })
      })
  }, [statisticProjectType])
  useEffect(() => {
    staticInstance.get(`CallAccountStatistic/${statisticAccountType}`)
      .then((res) => {
        setAccountData({
          labels: res?.data?.result.map((data) => {
            if (statisticAccountType === 'today') {
              return data.hourInDay
            } else if ((statisticAccountType === 'week')) {
              return data.dayInWeek;
            } else if (statisticAccountType === 'month') {
              return formatDate(data.dayInMonth)
            } else {
              return data.monthInYear
            }
          }),
          datasets: [
            {
              label: "Number Of Account",
              data: res?.data?.result.map((data) => data.count),
              backgroundColor: [
                "rgba(75,192,192,0.2)"
              ],
              borderWidth: 1,
            },
          ],
        })
      })
    staticInstance.get(`GetAllAccountInSystem`)
      .then((res) => {
        setAccountStatus({
          labels: res?.data?.result.map((data) => data.type),
          datasets: [
            {
              label: "Project Status",
              data: res?.data?.result.map((data) => data.count),
              backgroundColor: [
                "rgba(75,192,192,0.2)",
                "#ecf0f1",
                "#50AF95",
                "#f3ba2f",
                "#2a71d0",
              ],
              borderWidth: 1,
            },
          ],
        })
      })
  }, [statisticAccountType])
  useEffect(() => {
    staticInstance.get(`CallReportStatistic/${statisticReportType}`)
      .then((res) => {
        setReportData({
          labels: res?.data?.result.map((data) => {
            if (statisticReportType === 'today') {
              return data.hourInDay
            } else if ((statisticReportType === 'week')) {
              return data.dayInWeek;
            } else if (statisticReportType === 'month') {
              return formatDate(data.dayInMonth)
            } else {
              return data.monthInYear
            }
          }),
          datasets: [
            {
              label: "Number Of Report",
              data: res?.data?.result.map((data) => data.count),
              backgroundColor: [
                "rgba(75,192,192,0.2)"
              ],
              borderWidth: 1,
            },
          ],
        })
      })
    staticInstance.get(`GetAllReportInSystem`)
      .then((res) => {
        setReportStatus({

          labels: res?.data?.result.map((data) => data.type),
          datasets: [
            {
              label: "Project Status",
              data: res?.data?.result.map((data) => data.count),
              backgroundColor: [
                "rgba(75,192,192,0.2)",
                "#ecf0f1",
                "#50AF95",
                "#f3ba2f",
                "#2a71d0",
              ],
              borderWidth: 1,
            },
          ],
        })
      })
  }, [statisticReportType])
  useEffect(() => {
    staticInstance.get(`CallVerificationStatistic/${statisticVerificationType}`)
      .then((res) => {
        setVerifyData({
          labels: res?.data?.result.map((data) => {
            if (statisticVerificationType === 'today') {
              return data.hourInDay
            } else if ((statisticVerificationType === 'week')) {
              return data.dayInWeek;
            } else if (statisticVerificationType === 'month') {
              return formatDate(data.dayInMonth)
            } else {
              return data.monthInYear
            }
          }),
          datasets: [
            {
              label: "Number Of Verification",
              data: res?.data?.result.map((data) => data.count),
              backgroundColor: [
                "rgba(75,192,192,0.2)"
              ],
              borderWidth: 1,
            },
          ],
        })
      })
    staticInstance.get(`GetAllStatusVerificationInSystem`)
      .then((res) => {
        setVerifyStatus({

          labels: res?.data?.result.map((data) => data.type),
          datasets: [
            {
              label: "Project Status",
              data: res?.data?.result.map((data) => data.count),
              backgroundColor: [
                "rgba(75,192,192,0.2)",
                "#ecf0f1",
                "#50AF95",
                "#f3ba2f",
                "#2a71d0",
              ],
              borderWidth: 1,
            },
          ],
        })
      })
  }, [statisticVerificationType])
  const renderChart = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div style={{ width: "100%" }}>
            <div className="d-flex">
              <Col md={8} className="position-relative pt-3">
                {/* Render chart only if accountData has labels and datasets */}
                {accountData?.labels?.length > 0 && accountData?.datasets?.length > 0 && (
                  <>
                    <div className="position-absolute top-0 end-0">
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="white"
                          className="border-none text-body">
                          <MdBarChart size={14} className="icon_select" />
                        </Dropdown.Toggle>

                        <Dropdown.Menu style={{ minWidth: 'auto' }}>
                          <Dropdown.Item onClick={() => setStatisticAccountType('today')}>Today</Dropdown.Item>
                          <Dropdown.Item onClick={() => setStatisticAccountType('week')}>Week</Dropdown.Item>
                          <Dropdown.Item onClick={() => setStatisticAccountType('month')}>Month</Dropdown.Item>
                          <Dropdown.Item onClick={() => setStatisticAccountType('year')}>Year</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                    <BarChart chartData={accountData} value={color} style={{ minWidth: '100%' }} />
                  </>
                )}
              </Col>
              <Col md={4}>
                {/* Render chart only if accountStatus has labels and datasets */}
                {accountStatus?.labels?.length > 0 && accountStatus?.datasets?.length > 0 && (
                  <PieChart chartData={accountStatus} />
                )}
              </Col>
            </div>
          </div>
        );
      case 'post':
        return (
          <Row>
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
            <Col md={4} className="p-3">
              <h3 className="text-center">Highest view post in day</h3>
              <div className="w-100 border  p-2" style={{ maxHeight: '350px', overflowY: 'auto', borderRadius: '16px' }}>
                {postListTrend.map((item) => (
                  <div className="justify-content-between d-flex align-items-center mt-2">
                    <div className="post-img-container w-25">
                      <img src={item?.viewPostImages?.length === 0 ? defaultImage : item?.viewPostImages[0]?.imageSrc} alt="" />
                    </div>
                    <p className=" txt-overflow d-flex align-items-center ps-3 " style={{ width: '75%' }}>{item.title}</p>
                    <p className="d-flex align-items-center " style={{ width: '10%' }}>{item.view}</p>
                  </div>
                ))}

              </div>
            </Col>
          </Row>
        );
      case 'blog':
        return (
          <Row>
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
            </Col> <Col md={4} className="p-3">
              <h3 className="text-center">Highest view blog in day</h3>
              <div className="w-100 border  p-2" style={{ maxHeight: '350px', overflowY: 'auto', borderRadius: '16px' }}>
                {blogListTrend.map((item) => (
                  <div className="justify-content-between d-flex align-items-center mt-2">
                    <div className="post-img-container w-25">
                      <img src={item?.viewPostImages?.length === 0 ? defaultImage : item?.viewPostImages[0]?.imageSrc} alt="" />
                    </div>
                    <p className=" txt-overflow d-flex align-items-center ps-3 " style={{ width: '75%' }}>{item.title}</p>
                    <p className="d-flex align-items-center " style={{ width: '10%' }}>{item.view}</p>
                  </div>
                ))}

              </div>
            </Col>
          </Row>
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
                <PieChart chartData={projectStatus} />
              </Col>
            </div>

          </div>
        );
      case 'report':
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
                      <Dropdown.Item onClick={() => setStatisticReportType('today')}>Today</Dropdown.Item>
                      <Dropdown.Item onClick={() => setStatisticReportType('week')}>Week</Dropdown.Item>
                      <Dropdown.Item onClick={() => setStatisticReportType('month')}>Month</Dropdown.Item>
                      <Dropdown.Item onClick={() => setStatisticReportType('year')}>Year</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <BarChart chartData={reportData} />
              </Col>
              <Col md={4}>
                <PieChart chartData={reportStatus} />
              </Col>
            </div>

          </div>
        );
      case 'verification':
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
                      <Dropdown.Item onClick={() => setStatisticVerificationType('today')}>Today</Dropdown.Item>
                      <Dropdown.Item onClick={() => setStatisticVerificationType('week')}>Week</Dropdown.Item>
                      <Dropdown.Item onClick={() => setStatisticVerificationType('month')}>Month</Dropdown.Item>
                      <Dropdown.Item onClick={() => setStatisticVerificationType('year')}>Year</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <BarChart chartData={verifyData} />
              </Col>
              <Col md={4}>
                <PieChart chartData={verifyStatus} />
              </Col>
            </div>

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
          <Col md={4} className="" onResize={true}>
            <div className="d-flex align-items-center px-2 bg-white p-2" style={{ borderRadius: '8px' }}>
              <p className="text-center w-100 fs-4">
                Top 3 Freelancer
              </p>
            </div>
            {topFreelancer.map((item) => (
              <div className="d-flex align-items-center px-2 bg-white mt-2 p-2" style={{ borderRadius: '8px' }}>
                <div className="profile" style={{ width: '40px', height: '40px' }}>
                  <img src={item.avatar} alt="" />
                </div>
                <div className="d-flex justify-content-between w-75 ms-2">
                  <p>{item.fullName}</p>
                  <p>Invitation : {item.inviteCount}</p>
                </div>
              </div>
            ))}
          </Col>
          <Col md={4} className="px-0">
            <div className="d-flex align-items-center px-2 bg-white  p-2" style={{ borderRadius: '8px' }}>
              <p className="text-center w-100 fs-4">
                Top 3 Business
              </p>
            </div>
            {topBusiness.map((item) => (
              <div className="d-flex align-items-center  justify-content-between px-2 bg-white mt-2 p-2" style={{ borderRadius: '8px' }}>
                <div className="profile d-flex align-items-center" style={{ width: '40px', height: '40px' }}>
                  <img src={item.avatar} alt="" />
                </div>
                <p className="ms-2 w-25">{item.fullName}</p>
                <div className="d-flex align-items-center justify-content-end w-50 me-3">
                  <Rating initialValue={item.ratingAvg} readonly={true} allowFraction={true} size={18} />
                </div>
              </div>
            ))}
          </Col>
          <Col md={4}>
            <div className="d-flex align-items-center px-2 bg-white  p-2" style={{ borderRadius: '8px' }}>
              <p className="text-center w-100 fs-4">
                Top 3 Project
              </p>
            </div>
            {topProject.map((item) => (
              <div className="d-flex align-items-center  justify-content-between px-2 bg-white mt-2 p-2" style={{ borderRadius: '8px' }}>
                <div className="profile d-flex align-items-center" style={{ width: '80px', height: '40px', borderRadius: '8px' }}>
                  <img src={`https://localhost:7005/Images/${item.avatarProject}`} alt="" />
                </div>
                <p className="ms-2 w-50 txt-overflow" >{item.nameProject}</p>
                <div className="d-flex align-items-center justify-content-end w-25 me-3">
                  <p className="me-2 mt-1">{item.commentSum}</p>
                  <Rating initialValue={item.ratingAvg} readonly={true} allowFraction={true} size={18} />
                </div>
              </div>
            ))}
          </Col>
        </Row>
        <Row className="mt-2">
          <Col md={2} className="px-0">
            <CardItem
              icon={<VscAccount size={21} />}
              title="Account"
              count={8}
              active={activeTab === 'account'}
              onClick={() => handleTabClick('account')}
            />
          </Col>
          <Col md={2} className="px-0">
            <CardItem
              icon={<GoPencil size={21} />}
              title="Post"
              count={8}
              active={activeTab === 'post'}
              onClick={() => handleTabClick('post')}
            />
          </Col>
          <Col md={2} className="px-0">
            <CardItem
              icon={<FiBookOpen size={21} />}
              title="Blog"
              count={8}
              active={activeTab === 'blog'}
              onClick={() => handleTabClick('blog')}
            />
          </Col>
          <Col md={2} className="px-0">
            <CardItem
              icon={<LuBook size={21} />}
              title="Project"
              count={8}
              active={activeTab === 'project'}
              onClick={() => handleTabClick('project')}
            />
          </Col>
          <Col md={2} className="px-0">
            <CardItem
              icon={<TbMessageReport size={21} />}
              title="Report"
              active={activeTab === 'report'}
              onClick={() => handleTabClick('report')}
            />
          </Col>
          <Col md={2} className="px-0">
            <CardItem
              icon={<MdVerified size={21} />}
              title="Verification"
              count={8}
              active={activeTab === 'verification'}
              onClick={() => handleTabClick('verification')}
            />
          </Col>
        </Row>
        <Row className="ms-0 me-0">
          <div className="bg_custom" style={{ borderRadius: '8px' }}>
            {renderChart()}
          </div>
        </Row>
      </Col>
    </Row>
  );
}

export default Statistic;
