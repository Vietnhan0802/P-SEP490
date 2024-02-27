import React, { useEffect } from "react";
import { useState } from "react";
import "../Profile/profile.scss";
import { RiHome3Line } from "react-icons/ri";
import { FaChevronRight } from "react-icons/fa6";
import degree from "../../images/common/degree.png";
import project from "../../images/common/project.png";
import { FaArrowDownLong } from "react-icons/fa6";
import Follow from "../../components/follow";
import { Col, Row } from "react-bootstrap";
import ProfileReport from "../../components/Popup/ProfileReport";
import Cookies from "js-cookie";
import defaultImage from "../../images/common/default.png";
import { userInstance } from "../../axios/axiosConfig";
import { FiEdit } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { MdOutlineFileDownloadDone } from "react-icons/md";
import { FiFlag } from "react-icons/fi";
function Profile({ handleChangeImg }) {
  const initialValue = {
    avatar: "default",
    imageSrc: defaultImage,
    imageFile: null,
  };

  // ````````````````````````````
  const [value, setValue] = useState(initialValue);
  const user = JSON.parse(Cookies.get("user"));

  const [activePopup, setActivePopup] = useState(false);
  const [display, setDisplay] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const parsedDate = new Date(user.Date);
  const formattedDate = parsedDate.toISOString().split("T")[0];
  const [inputs, setInputs] = useState({
    userName: user.Username,
    fullName: user.FullName,
    date: formattedDate,
    isMale: user.IsMale === "True",
    phoneNumber: user.Phone,
    tax: user.Tax,
    address: user.Address,
    description: "Hello",
  });
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const handleUpdateUser = () => {
    setIsEdit(!isEdit);
    userInstance
      .put(`/UpdateUser/${user.Id}`, inputs, {
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
  const handleUpdateAvatar = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("avatar", value.avatar);
    formData.append("ImageFile", value.imageFile);
    formData.append("ImageSrc", value.imageSrc);
    userInstance
      .put(`/UpdateAvatar/${user.Id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Ensure Content-Type is set to multipart/form-data
        },
      })
      .then((res) => {
        setDisplay(false);
        if (res?.data?.status === "OK") {
          handleChangeImg("ok");
        }
        console.log(res?.data?.status);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };
  const showPreview = (e) => {
    if (e.target.files && e.target.files[0]) {
      let imageFile = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (x) => {
        setValue({
          ...value,
          imageFile,
          imageSrc: x.target.result,
        });
      };
      reader.readAsDataURL(imageFile);
    } else {
      setValue({
        ...value,
        imageFile: null,
        imageSrc: defaultImage,
      });
    }
  };

  const handleReportPopup = () => {
    setActivePopup(!activePopup);
  };
  // console.log(inputs);
  useEffect(() => {
    userInstance
      .get(`/GetUserById/${user.Id}`)
      .then((res) => {
        if (res?.data?.result.imageSrc === "https://localhost:7006/Images/")
          return;
        setValue({
          ...value,
          imageSrc: res?.data?.result.imageSrc,
        });
        // console.log(res?.data?.result.imageSrc);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, []);
  return (
    <>
      <Row className="mx-0 mt-3">
        <Col md={3}>
          <div id="sidebar-profile" className="bg-white p-5 position-relative ">
            <div className="text-center mb-3">
              <div className="person-name fs-3 fw-bold">{user.FullName}</div>
              <div className="account">{user.Username}</div>
            </div>
            <div className="information position-relative d-flex flex-column justify-content-center">
              <img
                src={value.imageSrc}
                alt=""
                className="w-100 rounded avatar m-auto"
              />
              {display ? (
                <div className="d-flex flex-column ">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={showPreview}
                    className="my-2"
                  />
                  <button
                    onClick={handleUpdateAvatar}
                    className="btn btn-primary m-auto"
                  >
                    {" "}
                    Submit
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
                  <CgProfile className="me-3" /> 0 followers · 1 following
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
              <FiFlag onClick={() => handleReportPopup()} />
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div id="profile">
            <div className="edit-btn-infor">
              {!isEdit && (
                <FiEdit
                  onClick={() => hanldeEdit()}
                  className="edit-icon mb-2 fs-2"
                />
              )}
              {isEdit && (
                <MdOutlineFileDownloadDone
                  onClick={() => handleUpdateUser()}
                  className="edit-icon mb-2 fs-2"
                />
              )}
            </div>

            <div class="bg-secondary-soft px-4 py-5 rounded">
              <div class="row g-3">
                <h4 class="mb-4 mt-0">Contact detail</h4>

                <div class="col-md-6">
                  <label class="form-label">Full Name</label>
                  <input
                    type="text"
                    class="form-control"
                    name="fullName"
                    value={inputs.fullName}
                    disabled={!isEdit}
                    onChange={handleChange}
                    aria-label="Full name"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label">Birthday</label>
                  <input
                    type="date"
                    name="date"
                    value={inputs.date}
                    disabled={!isEdit}
                    onChange={handleChange}
                    class="form-control"
                    aria-label="Birthday"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label">Phone number</label>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={inputs.phoneNumber}
                    disabled={!isEdit}
                    onChange={handleChange}
                    class="form-control"
                    aria-label="Phone number"
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label">Gender</label>
                  <div class="form-control">
                    {!isEdit ? (
                      user.IsMale ? (
                        <p>Male</p>
                      ) : (
                        <p>FeMale</p>
                      )
                    ) : (
                      <div>
                        <label>
                          <input
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

                        <label>
                          <input
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

                <div class="col-md-6">
                  <label class="form-label">Address:</label>
                  <input
                    type="text"
                    name="address"
                    class="form-control"
                    value={inputs.address}
                    disabled={!isEdit}
                    onChange={handleChange}
                  />
                </div>

                <div class="col-md-6">
                  <label class="form-label">Tax:</label>
                  <input
                    type="number"
                    name="tax"
                    value={inputs.tax}
                    disabled={!isEdit}
                    onChange={handleChange}
                    class="form-control"
                    aria-label="Tax"
                  />
                </div>

                <div class="col-md-12 ">
                  <label class="form-label">Description:</label>
                  <input
                    type="text"
                    name="description"
                    value={inputs.description}
                    disabled={!isEdit}
                    onChange={handleChange}
                    class="form-control"
                    aria-label="Description"
                  />
                </div>
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
