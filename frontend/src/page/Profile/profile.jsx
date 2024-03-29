import React, { useEffect } from "react";
import { useState } from "react";
import "../Profile/profile.scss";
import "../Profile/check-box.scss";
import "../Profile/project.scss";
import "../Profile/switchbtn.scss";
import degree from "../../images/common/degree.png";
import Follow from "../../components/follow";
import { Button, Col, Dropdown, Row } from "react-bootstrap";
import defaultImage from "../../images/common/default.png";
import {
  blogInstance,
  credentialInstance,
  followInstance,
  postInstance,
  projectInstance,
  userInstance,
} from "../../axios/axiosConfig";
import { CgProfile } from "react-icons/cg";
import { useLocation, useNavigate } from "react-router-dom";
import defaultProject from "../../images/common/default_project.webp";
import DegreePu from "./degreePu";
import UpdateAvatarPu from "./UpdateAvatarPu";
import Report from "../../components/report-popup/Report";
import UpdateInformationPu from "./UpdateInformationPu";
import { BsThreeDots } from "react-icons/bs";
import ChangePass from "./ChangePass";
import { FiEdit } from "react-icons/fi";
// Import the main component
import { Viewer } from '@react-pdf-viewer/core';

// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Worker } from '@react-pdf-viewer/core';
import Verification from "./Verification";
import Notification, { notifySuccess, notifyError } from "../../../src/components/notification";
function formatDateString(dateString) {
  // Check if the dateString is not empty
  if (dateString) {
    // Split the date string to separate date and time parts
    const [datePart] = dateString.split("T");
    // Return the formatted date string in yyyy-mm-dd format
    return datePart;
  }
  // If dateString is empty, return an empty string
  return "";
}
function Profile({ handleChangeImg, value, resetFollowing }) {

  // ````````````````````````````

  const navigate = useNavigate();
  const location = useLocation();
  // ````````````````````````````
  const [user, setUser] = useState({});
  const [follow, setFollow] = useState(true);
  const [tab, setTab] = useState("");
  const sessionData = JSON.parse(sessionStorage.getItem("userSession")) || {};
  const { role, currentUserId } = sessionData;
  const { userId } = location.state || {};
  const [resetAvatar, setResetAvatar] = useState(true);
  const [resetDegree, setResetDegree] = useState(true);
  const [showAllItems, setShowAllItems] = useState(false);
  const [display, setDisplay] = useState(false);
  const [updateDisplay, setUpdateDisplay] = useState(false);
  const [inputs, setInputs] = useState({
    userName: "",
    fullName: "",
    isMale: true,
    phoneNumber: "",
    tax: "",
    address: "",
    description: "Hello",
    imageSrc: "",
    follower: 0,
    following: 0,
    isFollow: true,
    role: "",
    email: ""
  });
  const [userPost, setUserPost] = useState([]);
  const [userProject, setUserProject] = useState([]);
  const [userBlog, setUserBlog] = useState([]);
  const [userDegree, setUserDegree] = useState([]);
  useEffect(() => {
    userInstance
      .get(`GetUserById/${currentUserId}?idAccount=${userId}`)
      .then((res) => {
        setUser(res?.data?.result);
        const user = res?.data?.result;
        if (user.role === "Admin") {
          setTab("blog");
        } else if (user.role === "Business") {
          setTab("post");
        } else {
          setTab("degree");
        }
        // Update inputs here after user is fetched
        setInputs({
          userName: user?.userName || "",
          fullName: user?.fullName || "",
          date: formatDateString(user?.date) || "",
          isMale: user?.isMale, // Assuming isMale is returned as "True" or "False" string
          phoneNumber: user?.phoneNumber || "",
          tax: user?.tax || "",
          address: user?.address || "",
          description: user?.description || "",
          imageSrc: user?.imageSrc,
          follower: user?.follower,
          following: user?.following,
          isFollow: user?.isFollow,
          role: user?.role,
          email: user?.email
        });
        if (user.role === "Business") {
          postInstance
            .get(`GetPostByUser/${userId}`)
            .then((res) => {
              setUserPost(res?.data?.result);
            })
            .catch((error) => {
              console.error(error);
            });
          projectInstance
            .get(`GetProjectByUser/${userId}`)
            .then((res) => {
              setUserProject(res?.data?.result);
            })
            .catch((error) => {
              console.error(error);
            });
        }
        if (user.role === "Admin") {
          blogInstance
            .get(`GetBlogByUser/${userId}`)
            .then((res) => {
              setUserBlog(res?.data?.result);
            })
            .catch((error) => {
              console.log(error);
            });
        }

        if (user.role === "Member") {
          credentialInstance
            .get(`/GetDegreeByUser/${userId}`, {
              headers: {
                accept: 'application/json'
              }
            })
            .then((res) => {
              setUserDegree(res?.data?.result);
            })
            .catch((error) => {
              console.error(error);
            });
        }
      });
  }, [userId, resetAvatar, resetDegree]);
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const projectStatus = (process) => {
    switch (process) {
      case 0:
        return <p>Preparing</p>;
      case 1:
        return <p>Processing</p>;
      case 2:
        return <p>Pending</p>;
      case 3:
        return <p>Done</p>;
      default:
        return "";
    }
  };

  const handleUpdateAppear = () => {
    setDisplay(true);
  };

  const hanldeSetTab = (tab) => {
    setTab(tab);
    setShowAllItems(!showAllItems);
  };
  const handleFollow = () => {
    followInstance
      .post(
        `/FollowOrUnfollow/${currentUserId}/${userId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        setInputs((prevInputs) => ({
          ...prevInputs,
          isFollow: !inputs.isFollow,
        }));
        setFollow(!follow);
        resetFollowing('Success');
        if (inputs.isFollow){
          notifySuccess("Follow is success!");
        }
        else{
          notifySuccess("Unfollow is success!");
        }
      })
      .catch((error) => {
        console.error(error);
        notifyError("Follow is fail!");
      });
  };
  const [tabs, setTabs] = useState([]);
  const changeImage = (value) => {
    if (value === "ok") {
      setResetAvatar(!resetAvatar);
      handleChangeImg("ok");
    }
  };
  useEffect(() => {
    // Xác định tabs dựa trên role của user
    let tabsBasedOnRole = [];
    if (user.role === "Member") {
      tabsBasedOnRole.push({ id: 1, title: "Degree", action: "degree" });
    }
    if (user.role === "Admin") {
      tabsBasedOnRole.push({ id: 2, title: "Blog", action: "blog" });
    }
    if (user.role === "Business") {
      tabsBasedOnRole.push({ id: 3, title: "Post", action: "post" });
    }
    if (user.role !== "Admin") {
      tabsBasedOnRole.push({
        id: tabsBasedOnRole.length + 1,
        title: "Project",
        action: "project",
      });
    }
    setTabs(tabsBasedOnRole);
  }, [user.role]); // Chỉ chạy lại khi user.role thay đổi
  const reset = (value) => {
    setResetAvatar(!resetAvatar);
  }
  const navigateChat = () => {
    navigate('/chat', { state: { userId: userId } });
  }
  const handleEditInfor = () => {
    setUpdateDisplay(true);
  }
  return (
    <>
      <Row className="mx-0 mt-3 pb-3">
        <Col md={3}>
          <div id="sidebar-profile" className="bg-white p-5 position-relative ">
            <div className="text-center mb-3">
              <div className="person-name fs-3 fw-bold">{inputs.fullName}</div>
              <div className="account">{inputs.userName}</div>
            </div>
            <div className="information position-relative align-items-center d-flex flex-column justify-content-center">
              <div className="avatar-contain wh-200">
                <img
                  src={
                    inputs.imageSrc === "https://localhost:7006/Images/"
                      ? defaultImage
                      : inputs.imageSrc
                  }
                  alt=""
                  className="m-auto"
                />
              </div>

              <UpdateAvatarPu
                show={display}
                onClose={() => setDisplay(!display)}
                image={inputs.imageSrc}
                currentUserId={currentUserId}
                changeImage={changeImage}
              />
              {display === false && currentUserId !== userId ? (
                <div className="d-flex justify-content-evenly w-100 mt-3">
                  <button
                    className="btn edit-btn mx-3 w-50"
                    onClick={() => handleFollow()}
                  >
                    {inputs.isFollow ? "UnFollow" : "Follow"}
                  </button>
                  <button
                    className="btn edit-btn mx-3 w-50"
                    onClick={() => navigateChat()}
                  >
                    Chat
                  </button>
                </div>

              ) : (
                <button
                  className="btn edit-btn mt-3 w-75 m-auto"
                  onClick={handleUpdateAppear}
                >
                  Edit Avatar
                </button>
              )}
              <div className="w-100 text-center">
                <div className="personal-information-text mt-4"></div>
                <div className="d-flex align-items-center justify-content-center mt-3">
                  <CgProfile className="me-3" /> {inputs.follower} followers ·{" "}
                  {inputs.following} following
                </div>
              </div>
            </div>
            <div className="fs-3 position-absolute top-0 end-0">
              {currentUserId !== userId ? (
                <Report id={currentUserId} idItem={userId} type="account" />) : ""}
            </div>
          </div>
        </Col>
        <Col md={6}>
          <UpdateInformationPu value={inputs} id={currentUserId} reset={reset} show={updateDisplay} onClose={() => setUpdateDisplay(false)} handleChangeImg={handleChangeImg} />
          <div id="profile">
            <div className="bg-secondary-soft p-3  rounded">
              <div className="row g-3">
                <div className="d-flex flex-row justify-content-between">
                  {" "}
                  <h4>Contact detail</h4>
                  {currentUserId === userId ? (
                    <div className="edit-text-white btn-info btnr">
                      {currentUserId === userId ? (
                        <Dropdown>
                          <Dropdown.Toggle
                            as={Button}
                            variant="white"
                            className="border-none text-body"
                          >
                            <BsThreeDots size={28} />
                          </Dropdown.Toggle>

                          <Dropdown.Menu style={{ minWidth: "auto" }}>
                            <Dropdown.Item>
                              <FiEdit onClick={handleEditInfor} size={28} />
                            </Dropdown.Item>
                            {(role === 'Business' || role === 'Member') &&
                              <Dropdown.Item>
                                <Verification id={currentUserId} />
                              </Dropdown.Item>
                            }
                            <Dropdown.Item>
                              <ChangePass email={inputs.email} />
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      ) : (""
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label">Full Name:</label>
                  <p className="form-control">{inputs.fullName}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label">
                    {inputs.role === "Business" ? "Establish date" : "Birthday"}
                  </label>
                  <p className="form-control">{inputs.date}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone number</label>
                  <p className="form-control">{inputs.phoneNumber}</p>
                </div>
                <div className="col-md-6">
                  {inputs.role !== "Business" && (
                    <div>
                      <label className="form-label">Gender:</label>
                      <div className="form-control">
                        {user.isMale ? (
                          <p>Male</p>
                        ) : (
                          <p>Female</p>
                        )
                        }
                        <UpdateInformationPu value={inputs} id={currentUserId} reset={reset} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Address:</label>
                  <p className="form-control">{inputs.address}</p>
                </div>
                <div className="col-md-6">
                  <label className="form-label ">Tax:</label>
                  <p className="form-control">{inputs.tax}</p>
                </div>
                <div className="col-md-12 ">
                  <label className="form-label">Description:</label>
                  <p className="form-control">{inputs.description ? inputs.description : 'No description'}</p>
                </div>
              </div>
            </div>
          </div>
          <section id="switch" className="mt-3">
            <div className="btn-swtich d-flex flex-row justify-content-between mb-2">
              <div className="action-swap tabs">
                {tabs.map((tab, index) => (
                  <React.Fragment key={index}>
                    <input
                      type="radio"
                      id={`radio-${index + 1}`}
                      name="tabs"
                      defaultChecked={index === 0}
                      onClick={() => hanldeSetTab(tab.action)}
                    />
                    <label className="tab" htmlFor={`radio-${index + 1}`}>
                      {tab.title}
                    </label>
                  </React.Fragment>
                ))}
                <span className="glider"></span>
              </div>
              <div className="action-user d-flex flex-row align-items-center justify-content-end">
                {user.role === "Member" && tab === "degree" && (
                  <DegreePu user={currentUserId} />
                )}
                {user.role === "Member" && tab === "degree" && (
                  <button
                    className={`height-50 text-white btn-info btn ${tab === "degree" ? "active" : ""
                      }`}
                    onClick={() => hanldeSetTab("degree")}
                  >
                    {showAllItems ? "Show Less" : "View All"}
                  </button>
                )}

                {user.role === "Admin" && tab === "blog" && (
                  <button
                    className={`height-50 text-white btn-info btn ${tab === "blog" ? "active" : ""
                      }`}
                    onClick={() => hanldeSetTab("blog")}
                  >
                    {" "}
                    View All
                  </button>
                )}
                {user.role === "Business" && tab === "post" && (
                  <button
                    className={`height-50 text-white btn-info btn ${tab === "post" ? "active" : ""
                      }`}
                    onClick={() => hanldeSetTab("post")}
                  >
                    {" "}
                    View All
                  </button>
                )}
                {user.role !== "Admin" && tab === "project" && (
                  <button
                    className={`height-50 text-white btn-info btn ${tab === "project" ? "active" : ""
                      }`}
                    onClick={() => hanldeSetTab("project")}
                  >
                    {" "}
                    View All
                  </button>
                )}
              </div>
            </div>
            <div>
              {user.role === "Member" && tab === "degree" && (
                <div
                  className={`degree tab-content ${showAllItems ? "scrollable" : ""
                    }`}
                >
                  {userDegree?.length !== 0 ? userDegree
                    .slice(0, showAllItems ? userDegree?.length : 3)
                    .map((item) => (
                      <div className="row mb-4" key={item.idDegree}>
                        <div className="col-2 d-flex justify-content-center img-contain">
                          <img src={degree} alt="" className="image" />
                        </div>
                        <div className="col-7 d-flex flex-column justify-content-center">
                          <p className="degree-title ellipsis">
                            Degree title:
                            {item.name}
                          </p>
                          <p className="degree-description ellipsis">
                            Degree institution:
                            {item.institution}
                          </p>
                        </div>
                        <div className="col-3 d-flex justify-content-center align-items-center">
                          <a
                            href={item.fileSrc} // Link to the PDF file
                            target="_blank" // Open in a new tab
                            rel="noopener noreferrer" // Security best practice
                            className="btn degree-detail btn-info text-white"
                          >
                            View Detail
                          </a>
                          {/* <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                            <div
                              style={{
                                border: '1px solid rgba(0, 0, 0, 0.3)',
                                height: '750px',
                              }}
                            >
                              <Viewer fileUrl={item.fileSrc}
                               />
                            </div>
                          </Worker> */}
                        </div>
                      </div>
                    )) : <p>There is no degree</p>}
                </div>
              )}
              {/* DegreeTab */}
              {user.role === "Business" && tab === "post" && (
                <div className="post tab-content">
                  {userPost?.length > 0 ? (
                    userPost?.map((post) => (
                      <div className="row">
                        <div className="col-3 d-flex justify-content-center img-contain">
                          <img
                            src={
                              post.viewPostImages.length > 0
                                ? post.viewPostImages[0].imageSrc
                                : defaultProject
                            }
                            alt=""
                            className="image"
                          />
                        </div>
                        <div className="col-7 d-flex flex-column justify-content-start">
                          <div className="d-flex items-center">
                            <div className="avatar-contain me-2">
                              <img
                                src={post.avatar}
                                alt="Instructor Cooper Bator"
                              />
                            </div>
                            <div className="left-30 d-flex flex-column justify-content-center">
                              <div className="size-20 SFU-heavy d-flex ellipsis">
                                {post.fullName}
                              </div>
                              <div className="size-14 SFU-reg text-gray-600 d-flex ellipsis">
                                {formatDateString(post.createdDate)}
                              </div>
                            </div>
                          </div>
                          <p className="degree-description ellipsis">
                            Post Title: {post.title}
                          </p>
                        </div>
                        <div className="col-2 d-flex justify-content-center align-items-center">
                          <button className="btn degree-detail">
                            View Detail
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>There is no post </p>
                  )}
                </div>
              )}
              {/* Posttab of business profile*/}
              {user.role === "Admin" && tab === "blog" && (
                <div className="blog tab-content">
                  {userBlog?.length > 0 ? (
                    userBlog?.map((blog) => (
                      <div
                        className="row align-items-center mb-3"
                        key={blog.idBlog}
                      >
                        <div className="col-3 d-flex justify-content-center img-contain">
                          <img
                            src={
                              blog?.viewBlogImages?.length > 0
                                ? blog?.viewBlogImages[0].imageSrc
                                : defaultProject
                            }
                            alt=""
                            className="image"
                          />
                        </div>
                        <div className="col-7 d-flex flex-column justify-content-start">
                          <div className="d-flex items-center">
                            <div className="avatar-contain me-2">
                              <img
                                src={blog.avatar}
                                alt="Instructor Cooper Bator"
                              />
                            </div>

                            <div className="left-30 d-flex flex-column justify-content-center">
                              <div className="size-20 SFU-heavy d-flex ellipsis">
                                {blog.fullName}
                              </div>
                              <div className="size-14 SFU-reg text-gray-600 d-flex ellipsis">
                                {formatDateString(blog.createdDate)}
                              </div>
                            </div>
                          </div>
                          <p className="degree-description ellipsis">
                            Post Title:{blog.title}
                          </p>
                        </div>
                        <div className="col-2 d-flex justify-content-center align-items-center">
                          <button className="btn degree-detail">
                            View More
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>There is no blog</p>
                  )}
                </div>
              )}
              {user.role !== "Admin" && tab === "project" && (
                <div className="project tab-content">
                  <div className="row" id="all-projects">
                    {userProject?.length > 0 ? (
                      userProject?.map((project) => (
                        <div className="col-md-6" id="project-items-1">
                          <div className="card">
                            <div className="card-body">
                              <div className="d-flex mb-3">
                                <div className="flex-grow-1 align-items-start">
                                  <div>
                                    <h6 className="mb-0 text-muted">
                                      <i className="mdi mdi-circle-medium text-danger fs-3 align-middle"></i>
                                      <span className="team-date">
                                        {formatDateString(project.createdDate)}
                                      </span>
                                    </h6>
                                  </div>
                                </div>
                              </div>

                              <div className="mb-4">
                                <h5 className="mb-1 font-size-17 team-title ellipsis">
                                  {project.name}
                                </h5>
                                <p className="text-muted mb-0 team-description ellipsis">
                                  {project.description}
                                </p>
                              </div>
                              <div className="d-flex">
                                <div className="avatar-group float-start flex-grow-1 task-assigne">
                                  {/* Clone from */}
                                  <div className="avatar-group-item">
                                    <img
                                      src="https://bootdey.com/img/Content/avatar/avatar1.png"
                                      alt=""
                                      className="rounded-circle avatar-sm"
                                    />
                                  </div>
                                  {/* to THis */}
                                  <div className="avatar-group-item">
                                    <img
                                      src="https://bootdey.com/img/Content/avatar/avatar1.png"
                                      alt=""
                                      className="rounded-circle avatar-sm"
                                    />
                                  </div>
                                  <div className="avatar-group-item">
                                    <img
                                      src="https://bootdey.com/img/Content/avatar/avatar1.png"
                                      alt=""
                                      className="rounded-circle avatar-sm"
                                    />
                                  </div>
                                </div>
                                <div className="align-self-end">
                                  <span className="badge badge-soft-danger p-2 team-status">
                                    {projectStatus(project.process)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>There is no project</p>
                    )}
                  </div>
                </div>
              )}

              {/* PrijectTab of business profile */}
            </div>
          </section>
        </Col>
        <Col md={3}>
          <Follow followValue={value} />
        </Col>
      </Row>
    </>
  );
}
export default Profile;
