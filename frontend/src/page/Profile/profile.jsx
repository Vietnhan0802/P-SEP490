import React, { useEffect } from "react";
import { useState } from "react";
import "../Profile/profile.scss";
import "../Profile/check-box.scss";
import "../Profile/project.scss";
import "../Profile/switchbtn.scss";
import degree from "../../images/common/degree.png";
import Follow from "../../components/follow";
import { Col, Row } from "react-bootstrap";
import ProfileReport from "../../components/Popup/ProfileReport";
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
import { useLocation } from "react-router-dom";
import defaultProject from "../../images/common/default_project.webp";
import DegreePu from "./degreePu";
import UpdateAvatarPu from "./UpdateAvatarPu";
import AccountReport from "../../components/report-popup/AccountReport";
import UpdateInformationPu from "./UpdateInformationPu";
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
function Profile({ handleChangeImg }) {
  const location = useLocation();
  // ````````````````````````````
  const [user, setUser] = useState({});
  const [follow, setFollow] = useState(true);
  const [tab, setTab] = useState("");
  const sessionData = JSON.parse(sessionStorage.getItem("userSession")) || {};
  const { currentUserId } = sessionData;
  const { userId } = location.state || {};
  const [activePopup, setActivePopup] = useState(false);
  const [resetAvatar, setResetAvatar] = useState(true);
  const [resetDegree, setResetDegree] = useState(true);
  const [showAllItems, setShowAllItems] = useState(false);
  const [display, setDisplay] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
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
            .get(`/GetDegreeByUser/${userId}`)
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
  const handleUpdateUser = () => {
    setIsEdit(!isEdit);
    userInstance
      .put(`/UpdateUser/${currentUserId}`, inputs, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res?.data);
      })
      .catch((err) => {
        console.log(err?.data);
      });
  };
  const hanldeEdit = () => {
    setIsEdit(!isEdit);
  };
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdateAppear = () => {
    setDisplay(true);
  };

  const hanldeSetTab = (tab) => {
    setTab(tab);
    setShowAllItems(!showAllItems);
  };
  const handleReportPopup = () => {
    setActivePopup(!activePopup);
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
        console.log(res?.data?.result);
        setInputs((prevInputs) => ({
          ...prevInputs,
          isFollow: !inputs.isFollow,
        }));
        setFollow(!follow);
        setFollow(!follow);
      })
      .catch((error) => {
        console.error(error);
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
                <button
                  className="btn edit-btn mt-3 w-75 m-auto"
                  onClick={() => handleFollow()}
                >
                  {inputs.isFollow ? "UnFollow" : "Follow"}
                </button>
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
              <ProfileReport trigger={activePopup} setTrigger={setActivePopup}>
                <div className="bg-white profile-feedback">
                  <h4 className="mt-2 mb-3 border-bottom">Submit feedback</h4>
                  <p>Please enter your feedback below</p>
                  <textarea
                    name=""
                    id=""
                    cols="30"
                    rows="10"
                    placeholder="Is there something wrong with this user?"
                    className="mt-2"
                  ></textarea>
                  <div className="d-flex justify-content-end">
                    <button className="btn btn-secondary">Submit</button>
                  </div>
                </div>
              </ProfileReport>
              <AccountReport />
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div id="profile">
            <div className="bg-secondary-soft p-3  rounded">
              <div className="row g-3">
                <div className="d-flex flex-row justify-content-between">
                  {" "}
                  <h4 className="">Contact detail</h4>
                  {currentUserId === userId ? (
                    <div className="edit-text-white btn-info btnr">
                      {currentUserId === userId ? (
                        // <div className="edit-text-white btn-info btnr">
                        //   {!isEdit && (
                        //     <FiEdit
                        //       onClick={() => hanldeEdit()}
                        //       className="edit-icon mb-2 fs-2"
                        //     />
                        //   )}
                        //   {isEdit && (
                        //     <MdOutlineFileDownloadDone
                        //       onClick={() => handleUpdateUser()}
                        //       className="edit-icon mb-2 fs-2"
                        //     />
                        //   )}
                        // </div>
                        <UpdateInformationPu />
                      ) : (
                        ""
                      )}
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label">Full Name:</label>
                  <input
                    type="text"
                    className="form-control bg-text"
                    name="fullName"
                    value={inputs.fullName}
                    disabled={!isEdit}
                    onChange={handleChange}
                    aria-label="Full name"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    {inputs.role === "Business" ? "Establish date" : "Birthday"}
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={inputs.date}
                    disabled={!isEdit}
                    onChange={handleChange}
                    className="form-control bg-text"
                    aria-label="Birthday"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Phone number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={inputs.phoneNumber}
                    disabled={!isEdit}
                    onChange={handleChange}
                    className="form-control bg-text"
                    aria-label="Phone number"
                  />
                </div>

                <div className="col-md-6">
                  {inputs.role !== "Business" && (
                    <div>
                      <label className="form-label">Gender:</label>
                      <div className="form-control bg-text">
                        {!isEdit ? (
                          user.isMale ? (
                            <p>Male</p>
                          ) : (
                            <p>Female</p>
                          )
                        ) : (
                          <div className="checkbox-wrapper-13 bg-text">
                            <label>
                              <input
                                id="c1-13"
                                className="me-1"
                                type="checkbox"
                                checked={inputs.isMale}
                                name="isMale"
                                onChange={() =>
                                  handleChange({
                                    target: { name: "isMale", value: true },
                                  })
                                }
                              />
                              Male
                            </label>

                            <label className="ps-4">
                              <input
                                id="c1-13"
                                className="me-1"
                                type="checkbox"
                                checked={!inputs.isMale}
                                name="isMale"
                                onChange={() =>
                                  handleChange({
                                    target: { name: "isMale", value: false },
                                  })
                                }
                              />
                              Female
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Address:</label>
                  <input
                    type="text"
                    name="address"
                    className="form-control bg-text"
                    value={inputs.address}
                    disabled={!isEdit}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label ">Tax:</label>
                  <input
                    type="number"
                    name="tax"
                    value={inputs.tax}
                    disabled={!isEdit}
                    onChange={handleChange}
                    className="form-control bg-text"
                    aria-label="Tax"
                  />
                </div>

                <div className="col-md-12 ">
                  <label className="form-label">Description:</label>
                  <input
                    type="text"
                    name="description"
                    value={inputs.description || ""}
                    placeholder="Hope you will give us some description about yourselves"
                    disabled={!isEdit}
                    onChange={handleChange}
                    className="form-control bg-text"
                    aria-label="Description"
                  />
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
                    className={`height-50 text-white btn-info btn ${
                      tab === "degree" ? "active" : ""
                    }`}
                    onClick={() => hanldeSetTab("degree")}
                  >
                    {showAllItems ? "Show Less" : "View All"}
                  </button>
                )}

                {user.role === "Admin" && tab === "blog" && (
                  <button
                    className={`height-50 text-white btn-info btn ${
                      tab === "blog" ? "active" : ""
                    }`}
                    onClick={() => hanldeSetTab("blog")}
                  >
                    {" "}
                    View All
                  </button>
                )}
                {user.role === "Business" && tab === "post" && (
                  <button
                    className={`height-50 text-white btn-info btn ${
                      tab === "post" ? "active" : ""
                    }`}
                    onClick={() => hanldeSetTab("post")}
                  >
                    {" "}
                    View All
                  </button>
                )}
                {user.role !== "Admin" && tab === "project" && (
                  <button
                    className={`height-50 text-white btn-info btn ${
                      tab === "project" ? "active" : ""
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
                  className={`degree tab-content ${
                    showAllItems ? "scrollable" : ""
                  }`}
                >
                  {userDegree
                    .slice(0, showAllItems ? userDegree.length : 3)
                    .map((item) => (
                      <div className="row" key={item.idDegree}>
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
                            className="btn degree-detail"
                          >
                            View Detail
                          </a>
                        </div>
                      </div>
                    ))}
                </div>
              )}
              {/* DegreeTab */}
              {user.role === "Business" && tab === "post" && (
                <div className="post tab-content">
                  {userPost.length > 0 ? (
                    userPost.map((post) => (
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
                            <img
                              className="avata-s mr-4"
                              src={post.avatar}
                              alt="Instructor Cooper Bator"
                            />
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
                  {userBlog.length > 0 ? (
                    userBlog.map((blog) => (
                      <div
                        className="row align-items-center mb-3"
                        key={blog.idBlog}
                      >
                        <div className="col-3 d-flex justify-content-center img-contain">
                          <img
                            src={
                              blog.viewBlogImages.length > 0
                                ? blog.viewBlogImages[0].imageSrc
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
                    {userProject.length > 0 ? (
                      userProject.map((project) => (
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
          <Follow newFollow={follow} />
        </Col>
      </Row>
    </>
  );
}
export default Profile;
