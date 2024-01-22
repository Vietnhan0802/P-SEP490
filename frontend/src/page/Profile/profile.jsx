import React from "react";
import { useState, useEffect } from "react";
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
import Cookies from "js-cookie";
import defaultImage from "../../images/common/default.png"
import { userInstance } from "../../axios/axiosConfig";
import { FiEdit } from "react-icons/fi";
import { CgProfile } from "react-icons/cg";
import { MdOutlineFileDownloadDone } from "react-icons/md";
function Profile() {
  const initialValue = {
    avatar: "dafault",
    imageSrc: defaultImage,
    imageFile: null,
  }

  // ````````````````````````````
  const [value, setValue] = useState(initialValue);
  const user = JSON.parse(Cookies.get("user"));

  const [activePopup, setActivePopup] = useState(false);
  const [display, setDisplay] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedGender, setSelectedGender] = useState(null);
  const parsedDate = new Date(user.Date);
  const formattedDate = parsedDate.toISOString().split('T')[0];
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
    userInstance.put(`/UpdateUser/${user.Id}`, inputs,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      },)
      .then((res) => {
        console.log(res?.data);
      })
      .catch((err) => {
        console.log(err?.data);
      })
  }
  const hanldeEdit = () => {
    setIsEdit(!isEdit);
  }
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCheckboxChange = (gender) => {
    setSelectedGender(gender);
  };

  const handleUpdateAppear = () => {
    setDisplay(!display)
  }
  const handleUpdateAvatar = e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("avatar", value.avatar);
    formData.append("imageFile", value.imageFile);
    formData.append("imageSrc", value.imageSrc);
    console.log(formData);
    userInstance.put(`/UpdateAvatar/${user.Id}`, formData)
      .then((res) => {
        console.log(res?.data);
      })
      .catch((err) => {
        console.log(err);
      })
  }
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
      }
      reader.readAsDataURL(imageFile);
    }
  }

  const handleReportPopup = () => {
    setActivePopup(!activePopup);
  };
  return (
    <>
      <Row className="mx-0 mt-3">
        <Col md={3}>
          <div id="sidebar-profile" className="bg-white p-5 ">
            <div className="text-center mb-3">
              <div className="person-name fs-3 fw-bold">{user.FullName}</div>
              <div className="account">{user.Username}</div>
            </div>
            <div className="information position-relative d-flex flex-column justify-content-center">
              <img src={value.imageSrc} alt="" className="w-100 rounded avatar m-auto" onClick={handleUpdateAppear} />
              {display && (<div>
                <input type="file" accept="image/*" onChange={showPreview} />
                <button onClick={handleUpdateAvatar}> Submit</button>
              </div>)}
              <div className="w-100 text-center">
                <div className="personal-information-text mt-4">

                  <div>
                    <button className="btn edit-btn">Edit Avatar</button>
                    {/* <button
                      className="btn edit-btn"
                      onClick={() => handleReportPopup()}
                    >
                      Report
                    </button> */}
                  </div>

                </div>
                <div className="d-flex align-items-center justify-content-center mt-3">
                  <CgProfile className="me-3" /> 0 followers · 1 following
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
          </div>

        </Col>
        <Col md={6}>
          <div id="profile">
            <div className="nav d-flex align-items-center   justify-content-between w-100">
              <div className="bread-brumb mt-4 text-center d-flex align-items-center mb-2">
                <RiHome3Line className="me-2" />{" "}
                <FaChevronRight className="me-2 opacity-50" />{" "}
                <p className="fw-bold">Profile</p>
              </div>
              <div>
                {isEdit && <FiEdit onClick={() => hanldeEdit()} className="edit-icon  mt-4  mb-2 fs-2" />}
                {!isEdit && <MdOutlineFileDownloadDone onClick={() => handleUpdateUser()} className="edit-icon  mt-4  mb-2 fs-2" />}

              </div>
            </div>


            <div className="d-flex justify-content-center flex-column personal-information">
              <div>
                <div className="p-2 w-75 mb-4">
                  <div className="mb-2">Fullname</div>
                  <input
                    type="text"
                    className=" infor-group w-100"
                    name="fullName"
                    value={inputs.fullName}
                    disabled={isEdit}
                    onChange={handleChange}
                  />
                </div>
                <div className="p-2 w-50 mb-4 d-flex ">
                  <p className="me-4">Gender: </p>
                  {isEdit ?
                    user.IsMale ? <p >Male</p> : <p>FeMale</p> : (<>
                      <label>
                        <input
                          type="checkbox"
                          checked={inputs.isMale}
                          name="isMale"
                          disabled={isEdit}
                          onChange={() =>
                            handleChange({ target: { name: "isMale", value: true } })}
                        />
                        Male
                      </label>

                      <label>
                        <input
                          type="checkbox"
                          checked={!inputs.isMale}
                          name="isMale"
                          disabled={isEdit}
                          onChange={() =>
                            handleChange({ target: { name: "isMale", value: false } })}
                        />
                        Female
                      </label></>)}


                </div>
              </div>
              <div className="d-flex">
                <div className="w-50 p-2 mb-4">
                  <div className="mb-2">Username</div>
                  <input
                    type="text"
                    name="userName"
                    value={inputs.userName}
                    disabled={isEdit}
                    onChange={handleChange}
                    className=" infor-group  w-100"
                  />
                </div>
                <div className="w-50 p-2 mb-4">
                  <div className="mb-2">Birthday</div>

                  <input
                    type="date"
                    name="date"
                    value={inputs.date}
                    disabled={isEdit}
                    onChange={handleChange}
                    className=" infor-group  w-100"
                  />
                </div>
              </div>
              <div className="d-flex">
                <div className="w-50 mb-4 p-2">
                  <div className="mb-2">Tax</div>
                  <input
                    type="number"
                    name="tax"
                    value={inputs.tax}
                    disabled={isEdit}
                    onChange={handleChange}
                    className=" infor-group  w-100"
                  />
                </div>
                <div className="w-50 mb-4 p-2">
                  <div className="mb-2">Phone</div>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={inputs.phoneNumber}
                    disabled={isEdit}
                    onChange={handleChange}
                    className=" infor-group  w-100"
                  />
                </div>
              </div>

              <div className="w-75 m-auto  mb-4">
                <div className="mb-2">Address</div>
                <input
                  type="text"
                  name="address"
                  value={inputs.address}
                  disabled={isEdit}
                  onChange={handleChange}
                  className=" infor-group  w-100"
                />
              </div>

              <div className="w-100 m-auto mb-4">
                <div className="mb-2">Description</div>
                <textarea
                  className="w-100 infor-group"
                  type="text"
                  name="description"
                  placeholder="I'm a Product Designer based in Melbourne, Australia. I specialise in UX/UI design, brand strategy, and Webflow development."
                  value="Heloo"
                  onChange={handleChange}
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
      </Row >
    </>
  );
}

export default Profile;
