import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Profile/profile.scss";
import { IoSearch } from "react-icons/io5";
import avatar from "../../images/common/Avatar.png";
import { RiHome3Line } from "react-icons/ri";
import { FaChevronRight } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import degree from "../../images/common/degree.png";
import project from "../../images/common/project.png";
import { FaArrowDownLong } from "react-icons/fa6";
import SideBar from "../../components/sidebar";
import Follow from "../../components/follow";
import { Col, Row } from "react-bootstrap";
import ProfileReport from "../../components/Popup/ProfileReport";
function Profile() {
  const [activeComponent, setActiveComponent] = useState("");
  const [activePopup, setActivePopup] = useState(false);
  const navigate = useNavigate();

  const handleReportPopup = () => {
    setActivePopup(!activePopup);
  };
  const handleSidebarItemClick = (itemId) => {
    setActiveComponent(itemId);
    if (
      itemId.toLowerCase() === "post" ||
      itemId.toLowerCase() === "blog" ||
      itemId.toLowerCase() === "own_post" ||
      itemId.toLowerCase() === "own_project" ||
      itemId.toLowerCase() === "project_application" ||
      itemId.toLowerCase() === "verification" ||
      itemId.toLowerCase() === "current_project" ||
      itemId.toLowerCase() === "dashboard"
    ) {
      navigate("/home");
    }
  };
  return (
    <>
      <Row className="mx-0 mt-3">
        <Col md={3}>
          <SideBar
            activeItem={activeComponent}
            onItemClick={handleSidebarItemClick}
          />
        </Col>
        <Col md={6}>
          <div id="profile">
            <div className="nav">
              <div className="mb-2  d-flex justify-content-between w-100">
                <div className="profile-text">Profile</div>
                <div className="search border">
                  <div className="d-flex align-items-center ">
                    <IoSearch className="me-2" />
                    <input type="text" name="Search" placeholder="Search" />
                  </div>
                </div>
              </div>
            </div>
            <div className="information d-flex position-relative">
              <img src={avatar} alt="" />
              <div className="ms-3 w-100">
                <div className="bread-brumb mt-4  d-flex align-items-center">
                  <RiHome3Line className="me-2" />{" "}
                  <FaChevronRight className="me-2 opacity-50" />{" "}
                  <p className="fw-bold">Profile</p>
                </div>
                <div className="d-flex justify-content-between personal-information-text mt-4">
                  <div>
                    <div className="person-name">Olivia Rhye</div>
                    <div className="account">@olivia</div>
                  </div>
                  <div>
                    <button className="btn edit-btn">Edit</button>
                    <button
                      className="btn edit-btn"
                      onClick={() => handleReportPopup()}
                    >
                      Report
                    </button>
                  </div>
                </div>
              </div>
              <ProfileReport trigger={activePopup} setTrigger={setActivePopup}>
                <div className="bg-white profile-feedback">
                  <h3 className="mt-2 mb-3 border-bottom">Submit feedback</h3>

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
                    {" "}
                    <button className="btn btn-secondary">Submit</button>
                  </div>
                </div>
              </ProfileReport>
            </div>
            <div className="d-flex justify-content-center flex-column personal-information">
              <div className="w-75 m-auto  mb-4">
                <div className="mb-2">Fullname</div>
                <input
                  type="text"
                  placeholder="Olivia"
                  className=" infor-group w-100"
                />
              </div>
              <div className="w-75 m-auto mb-4">
                <div className="mb-2">Email</div>
                <div className="infor-group p-10 d-flex align-items-center">
                  <MdOutlineEmail className="email-icon " />
                  <input
                    type="text"
                    placeholder="olivia@untitledui.com"
                    className="w-100"
                  />
                </div>
              </div>
              <div className="w-75 m-auto  mb-4">
                <div className="mb-2">Role</div>
                <input
                  type="text"
                  placeholder="Product Designer"
                  className=" infor-group  w-100"
                />
              </div>
              <div className="w-100 m-auto mb-4">
                <div className="mb-2">Description</div>
                <textarea
                  className="w-100 infor-group"
                  type="text"
                  placeholder="I'm a Product Designer based in Melbourne, Australia. I specialise in UX/UI design, brand strategy, and Webflow development."
                ></textarea>
              </div>
            </div>
            <div className="degree">
              <p>Person’s Degree</p>
              <p>Share your reward.</p>
              <div>
                <p className="degree-header">Name</p>
                <div className="row">
                  <div className="col-3">
                    <img src={degree} alt="" className="image" />
                  </div>
                  <div className="col-6 d-flex flex-column justify-content-center">
                    <p className="degree-title">Lorem ipsum dolor sit amet </p>
                    <p className="degree-description">Lorem ipsum </p>
                  </div>
                  <div className="col-3 d-flex align-items-center">
                    <button className="btn degree-detail">View Detail</button>
                  </div>
                </div>
                <div className="row">
                  <div className="col-3">
                    <img src={degree} alt="" className="image" />
                  </div>
                  <div className="col-6 d-flex flex-column justify-content-center">
                    <p className="degree-title">Lorem ipsum dolor sit amet </p>
                    <p className="degree-description">Lorem ipsum </p>
                  </div>
                  <div className="col-3 d-flex align-items-center">
                    <button className="btn degree-detail">View Detail</button>
                  </div>
                </div>{" "}
                <div className="row">
                  <div className="col-3">
                    <img src={degree} alt="" className="image" />
                  </div>
                  <div className="col-6 d-flex flex-column justify-content-center">
                    <p className="degree-title">Lorem ipsum dolor sit amet </p>
                    <p className="degree-description">Lorem ipsum </p>
                  </div>
                  <div className="col-3 d-flex align-items-center">
                    <button className="btn degree-detail">View Detail</button>
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-center border view-more">
                <p>
                  View all degree <FaArrowDownLong className="ms-2" />
                </p>
              </div>
            </div>
            <div className="project mt-3">
              <p className="project-header">Name</p>
              <div className="row m-2">
                <div className="d-flex align-items-center col-3">
                  <img src={project} alt="" className="project-icon" />
                  <p className="ms-2">File #007</p>
                </div>
                <div className="col-4 d-flex align-items-center">
                  TNHH xây dựng Quang Dũng
                </div>
                <div className="col-3 d-flex align-items-center">
                  Dec 1, 2022
                </div>
                <div className="col-2 d-flex align-items-center download-text">
                  Download
                </div>
              </div>
              <div className="row m-2">
                <div className="d-flex align-items-center col-3">
                  <img src={project} alt="" className="project-icon" />
                  <p className="ms-2">File #006</p>
                </div>
                <div className="col-4 d-flex align-items-center">
                  Công ty TNHH nội thất Phạm Gia
                </div>
                <div className="col-3 d-flex align-items-center">
                  Nov 1, 2022
                </div>
                <div className="col-2 d-flex align-items-center download-text">
                  Download
                </div>
              </div>
              <div className="row m-2">
                <div className="d-flex align-items-center col-3">
                  <img src={project} alt="" className="project-icon" />
                  <p className="ms-2">File #005</p>
                </div>
                <div className="col-4 d-flex align-items-center">
                  Công ty cổ phần nhựa Ngọc Nghĩa
                </div>
                <div className="col-3 d-flex align-items-center">
                  Oct 1, 2022
                </div>
                <div className="col-2 d-flex align-items-center download-text">
                  Download
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col md={3}>
          <Follow />
        </Col>
      </Row>
    </>
  );
}

export default Profile;
