import React, { useEffect } from "react";
import { useState } from "react";
import "../Profile/profile.scss";
import "../Profile/check-box.scss";
import "../Profile/project.scss";
import "../Profile/switchbtn.scss";
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
import tick from "../../images/common/verifiedTick.png";
import UpdateAvatarPu from "./UpdateAvatarPu";
import Report from "../../components/report-popup/Report";
import UpdateInformationPu from "./UpdateInformationPu";
import { BsThreeDots } from "react-icons/bs";
import ChangePass from "./ChangePass";
import { FiEdit } from "react-icons/fi";
import { Rating } from 'react-simple-star-rating'

// Import the main component
import { Viewer } from '@react-pdf-viewer/core';

// Import the styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Worker } from '@react-pdf-viewer/core';
import Verification from "./Verification";
import Notification, { notifySuccess, notifyError } from "../../../src/components/notification";
import ProfileTab from "./ProfileTab";
import RatingProfile from "./RatingProfile";
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
  const sessionData = JSON.parse(sessionStorage.getItem("userSession")) || {};
  const { role, currentUserId } = sessionData;
  const { userId } = location.state || {};
  const [resetAvatar, setResetAvatar] = useState(true);
  const [resetDegree, setResetDegree] = useState(true);
  const [display, setDisplay] = useState(false);
  const [updateDisplay, setUpdateDisplay] = useState(false);
  const [showRating, setShowRating] = useState(false);

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
    email: "",
    ratingAvg: 0,
    ratingNum: 0
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
          email: user?.email,
          ratingAvg: user?.ratingAvg,
          ratingNum: user?.ratingNum
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
        if (inputs.isFollow) {
          notifySuccess("Follow is success!");
        }
        else {
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
      <Row className="mx-0 mt-3 pb-2">
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
                {user.isVerified && <img src={tick} alt="tick" className="position-absolute bottom-0" style={{ width: '50px', height: '50px', right: '16px' }} />}

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
            <div className="bg-white mt-3">
              <div className="d-flex justify-content-center" onClick={() => setShowRating(true)}>
                <Rating
                  initialValue={user.ratingAvg}
                  readonly={true}
                  allowFraction={true}
                />
              </div>
            </div>
          </div>
          <RatingProfile show={showRating} onClose={() => setShowRating(false)}
            id={currentUserId} formatDateString={formatDateString} role={role}
          />
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
            <ProfileTab
              tabs={tabs}
              user={user}
              currentUserId={currentUserId}
              userDegree={userDegree}
              userPost={userPost}
              userBlog={userBlog}
              userProject={userProject}
              formatDateString={formatDateString}
              projectStatus={projectStatus} />
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
