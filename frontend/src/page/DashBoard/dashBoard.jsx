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
import VerifyTable from "./DashboardTable/VerifyTable";
import { useTranslation } from 'react-i18next';
import SideBar from "../../components/sidebar";
import ProjectTable from "./DashboardTable/ProjectTable";
import { blogInstance, postInstance, projectInstance, userInstance } from "../../axios/axiosConfig";
function DashBoard() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("post");
  const [postList, setPostList] = useState([]);
  const [blogList, setBlogList] = useState([]);
  const [accessList, setAccessList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const sessionData = JSON.parse(sessionStorage.getItem("userSession")) || {};
  const { currentUserId } = sessionData;
  // const value = 13;
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  React.useEffect(() => {
    postInstance.get(`GetAllposts/${currentUserId}`)
      .then((res) => {
        setPostList(res?.data?.result);
      })
      .catch((err) => { console.log(err) });
    userInstance.get('GetAllUsers')
      .then((res) => {
        setAccessList(res?.data?.result);
      })
      .catch((err) => { console.log(err) });
    blogInstance.get(`GetAllBlogs/${currentUserId}`)
      .then((res) => {
        setBlogList(res?.data?.result);
      })
      .catch((err) => { console.log(err) });
    projectInstance.get(`GetAllProjects`)
      .then((res) => {
        setProjectList(res?.data?.result);
      })
      .catch((err) => { console.log(err) });
  }, []);
  const renderTable = () => {
    switch (activeTab) {
      case "post":
        return <PostTable value={postList} />;
      case "blog":
        return <BlogTable value={blogList} />;
      case "access":
        return <AccessTable value={accessList} />;
      case "report":
        return <ReportTable />;
      case "verify":
        return <VerifyTable />;
      case "project":
        return <ProjectTable valuer={projectList}/>;
      default:
        return null;
    }
  };
  return (
    <Row className="pt-3 ms-0 me-0">
      <Col md={3} >
        <SideBar />
      </Col>
      <Col md={9}>
        <div id="dashboard">
          <Row>
            <Col md={12}>
              <Row className="bg-white cover">
                <Col md={4} className="px-0">
                  <div
                    className={`card m-1 bg-white p-2 ${activeTab === "post" ? "active-tab" : ""
                      }`}
                  >
                    <div className="mb-1 fs-12">{t('managepost')}</div>
                    <div className="d-flex justify-content-between">
                      <p className="fs-24 fw-bold">{postList?.length} {t('post')}</p>
                    </div>
                    <hr style={{ margin: "0.5rem 0" }} />
                    <p
                      className="d-flex justify-content-end mt-2 detail" style={{ color: "#175CD3" }}
                      onClick={() => handleTabClick("post")}
                    >
                      {
                        activeTab === "post" ? t('viewing') : t('viewdetail')
                      }
                    </p>
                  </div>
                </Col>
                <Col md={4} className="px-0">
                  <div className={`card m-1 bg-white p-2 ${activeTab === "access" ? "active-tab" : ""
                    }`}>
                    <div className="mb-1 fs-12">{t('manageaccess')}</div>
                    <div className="d-flex justify-content-between">
                      <p className="fs-24 fw-bold">{accessList?.length} {t('newaccess')}</p>
                    </div>
                    <hr style={{ margin: "0.5rem 0" }} />
                    <p
                      className="d-flex justify-content-end mt-2 detail" style={{ color: "#175CD3" }}
                      onClick={() => handleTabClick("access")}
                    >
                      {
                        activeTab === "access" ? t('viewing') : t('viewdetail')
                      }
                    </p>
                  </div>
                </Col>
                <Col md={4} className="px-0">
                  <div className={`card m-1 bg-white p-2 ${activeTab === "blog" ? "active-tab" : ""
                    }`}>
                    <div className="mb-1 fs-12">{t('manageblog')}</div>
                    <div className="d-flex justify-content-between">
                      <p className="fs-24 fw-bold">{blogList?.length} {t('blog')}</p>
                    </div>
                    <hr style={{ margin: "0.5rem 0" }} />
                    <p
                      className="d-flex justify-content-end mt-2 detail" style={{ color: "#175CD3" }}
                      onClick={() => handleTabClick("blog")}
                    >
                      {
                        activeTab === "blog" ? t('viewing') : t('viewdetail')
                      }
                    </p>
                  </div>
                </Col>
                <Col md={4} className="px-0">
                  <div className={`card m-1 bg-white p-2 ${activeTab === "report" ? "active-tab" : ""
                    }`}>
                    <div className="mb-1 fs-12">{t('managereport')}</div>
                    <div className="d-flex justify-content-between">
                      <p className="fs-24 fw-bold">63 {t('newreport')}</p>
                    </div>
                    <hr style={{ margin: "0.5rem 0" }} />
                    <p
                      className="d-flex justify-content-end mt-2 detail" style={{ color: "#175CD3" }}
                      onClick={() => handleTabClick("report")}
                    >
                      {
                        activeTab === "report" ? t('viewing') : t('viewdetail')
                      }
                    </p>
                  </div>
                </Col>
                <Col md={4} className="px-0">
                  <div className={`card m-1 bg-white p-2 ${activeTab === "project" ? "active-tab" : ""
                    }`}>
                    <div className="mb-1 fs-12">Manage Project</div>
                    <div className="d-flex justify-content-between">
                      <p className="fs-24 fw-bold">63 Project</p>
                    </div>
                    <hr style={{ margin: "0.5rem 0" }} />
                    <p
                      className="d-flex justify-content-end mt-2 detail" style={{ color: "#175CD3" }}
                      onClick={() => handleTabClick("project")}
                    >
                      {
                        activeTab === "project" ? t('viewing') : t('viewdetail')
                      }
                    </p>
                  </div>
                </Col>
                <Col md={4} className="px-0">
                  <div className={`card m-1 bg-white p-2 ${activeTab === "verify" ? "active-tab" : ""
                    }`}>
                    <div className="mb-1 fs-12">Manage Verification</div>
                    <div className="d-flex justify-content-between">
                      <p className="fs-24 fw-bold">63 Verification</p>
                    </div>
                    <hr style={{ margin: "0.5rem 0" }} />
                    <p
                      className="d-flex justify-content-end mt-2 detail" style={{ color: "#175CD3" }}
                      onClick={() => handleTabClick("verify")}
                    >
                      {
                        activeTab === "verify" ? t('viewing') : t('viewdetail')
                      }
                    </p>
                  </div>
                </Col>
              </Row>
            </Col>
            {/* <Col md={3}>
              <div className="cover my-0 h-100">
                <p className="text-center fw-bold fs-20">{t('manageverification')}</p>
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
                        textColor: "var(--header_search_text)",
                        trailColor: "#BBC7F6",
                        backgroundColor: "#3e98c7",
                      })}
                    />
                  </div>
                </div>

                <p className="text-center my-2  ">{t('newverification')}</p>
                <div className="verification  d-flex justify-content-center">
                  <div className="mt-2 d-flex align-items-center justify-content-center detail" style={{ color: "#175CD3" }}
                    onClick={() => handleTabClick("verify")}
                  >
                    <MdFullscreen className="me-2 fs-30" /> <p>{
                      activeTab === "verify" ? t('viewing') : t('viewdetail')
                    }</p>
                  </div>
                </div>
              </div>
            </Col> */}
          </Row>
          <Row className="ps-0">{renderTable()}</Row>
        </div>
      </Col>

    </Row>
  );
}
export default DashBoard;
