import React from "react";
import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import "./dashBoard.scss";
import "react-circular-progressbar/dist/styles.css";
import PostTable from "./DashboardTable/PostTable";
import BlogTable from "./DashboardTable/BlogTable";
import AccessTable from "./DashboardTable/AccessTable";
import ReportTable from "./DashboardTable/ReportTable";
import VerifyTable from "./DashboardTable/VerifyTable";
import { useTranslation } from 'react-i18next';
import SideBar from "../../components/sidebar";
import ProjectTable from "./DashboardTable/ProjectTable";
import { blogInstance, postInstance, projectInstance, reportInstance, userInstance } from "../../axios/axiosConfig";

function ReportCount(count1 = 0, count2 = 0, count3 = 0) {
  const totalReports = count1 + count2 + count3;
  if (totalReports > 0) {
    return <p className="fs-24 fw-bold">{totalReports} Report</p>;
  } else {
    // Optionally, return something to indicate no reports
    return <p>No reports</p>; // Or <p>No reports</p>;
  }
}
function DashBoard() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState("post");
  const [postList, setPostList] = useState([]);
  const [blogList, setBlogList] = useState([]);
  const [accessList, setAccessList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [accountReportList, setAccountReportList] = useState([]);
  const [blogReportList, setBlogReportList] = useState([]);
  const [portReportList, setPostReportList] = useState([]);
  const [reset, setReset] = useState(false);
  const [resetAcc, setResetAcc] = useState(false);
  const [resetRe, setResetRe] = useState(false);
  const [resetBlogRender, setResetBlogRender] = useState(false);
  const [resetVerification, setResetVerification] = useState(false);
  const [verificationList, setVerificationList] = useState(false);
  const [verificationAcceptedList, setVerificationAcceptedList] = useState(false);
  const sessionData = JSON.parse(sessionStorage.getItem("userSession")) || {};
  const { currentUserId } = sessionData;
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  // User
  React.useEffect(() => {
    userInstance.get('GetAllUsers')
      .then((res) => {
        setAccessList(res?.data?.result || []);
      })
      .catch((err) => { console.log(err) });
  }, [resetAcc])
  //Blog
  React.useEffect(() => {
    blogInstance.get(`GetAllBlogs/${currentUserId}`)
      .then((res) => {
        setBlogList(res?.data?.result || []);
      })
      .catch((err) => { console.log(err) });
  }, [resetBlogRender])
  // Report
  React.useEffect(() => {
    reportInstance.get(`GetAllAccountReport`)
      .then((res) => {
        setAccountReportList(res?.data?.result || []);
      })
      .catch((err) => { console.log(err) });
    reportInstance.get(`GetAllBlogReport`)
      .then((res) => {
        setBlogReportList(res?.data?.result || []);
      })
      .catch((err) => { console.log(err) });
    reportInstance.get(`GetAllPostReport`)
      .then((res) => {
        setPostReportList(res?.data?.result || []);
      })
      .catch((err) => { console.log(err) });
  }, [resetRe])
  //Post && Project
  React.useEffect(() => {
    postInstance.get(`GetAllPosts/${currentUserId}`)
      .then((res) => {
        setPostList(res?.data?.result || []);
      })
      .catch((err) => { console.log(err) });

    projectInstance.get(`GetAllProjects`)
      .then((res) => {
        setProjectList(res?.data?.result || []);
      })
      .catch((err) => { console.log(err) });
  }, [reset]);
  //Verification
  React.useEffect(() => {
    reportInstance.get(`GetAllVerification`)
      .then((res) => {
        setVerificationList(res?.data?.result || []);
      })
      .catch((err) => { console.log(err) });
    reportInstance.get(`VerificationAccepted`)
      .then((res) => {

        setVerificationAcceptedList(res?.data?.result || []);
      })
      .catch((err) => { console.log(err) });
  }, [resetVerification])

  const verifiListLength = verificationAcceptedList?.length + verificationList?.length;
  console.log(verifiListLength);

  const resetAccount = () => {
    setResetAcc((prevReset) => !prevReset)
  }
  const resetTable = () => {
    setReset((prevReset) => !prevReset)
  }
  const resetBlog = () => {
    setResetBlogRender((prevReset) => !prevReset)
  }
  const resetReport = () => {
    setResetRe((prevReset) => !prevReset)
  }
  const resetVerify = () => {
    setResetVerification(prevReset => !prevReset);
  }

  const renderTable = () => {
    switch (activeTab) {
      case "post":
        return <PostTable value={postList} resetTable={resetTable} />;
      case "blog":
        return <BlogTable value={blogList} resetBlog={resetBlog} />;
      case "access":
        return <AccessTable value={accessList} resetAccount={resetAccount} />;
      case "report":
        return <ReportTable
          accountValue={accountReportList}
          postValue={portReportList}
          blogValue={blogReportList}
          resetReport={resetReport} />;
      case "verify":
        return <VerifyTable value={verificationList} verified={verificationAcceptedList} resetVerify={resetVerify} />;
      case "project":
        return <ProjectTable value={projectList} />;
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
                      <p className="fs-24 fw-bold">{postList?.length} {t('post')}{postList?.length > 1 && 's'}</p>
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
                      <p className="fs-24 fw-bold">{blogList?.length} {t('blog')}{blogList?.length > 1 && 's'}</p>
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
                      <p className="fs-24 fw-bold">{ReportCount(accountReportList?.length, blogReportList?.length, portReportList?.length)}</p>
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
                      <p className="fs-24 fw-bold">{projectList.length} Project{projectList.length > 1 && 's'}</p>
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
                      <p className="fs-24 fw-bold">{verifiListLength > 0 ? verifiListLength : 0}  Verification{verifiListLength > 0 && 's'}</p>
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
          </Row>
          <Row className="ps-0">{renderTable()}</Row>
        </div>
      </Col>

    </Row>
  );
}
export default DashBoard;
