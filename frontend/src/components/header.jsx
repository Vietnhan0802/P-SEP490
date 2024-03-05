import React, { useEffect } from "react";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../scss/header.scss";
import { Row, Col, Image } from "react-bootstrap";
import { CiSearch } from "react-icons/ci";
import { LuHome } from "react-icons/lu";
import logoImg from "../images/common/logo.png";
import { IoChatbubblesOutline } from "react-icons/io5";
import { IoIosNotificationsOutline } from "react-icons/io";
import defaultImage from "../images/common/default.png"
import Popup from "./Popup/Popup";
import Notify from "../page/Notify/notify";
import DarkMode from "./darkmode";
import { userInstance } from "../axios/axiosConfig";
import { useNavigate } from "react-router-dom";
export default function Header({ activeComponent, onItemClick, changeImage }) {
  const sessionData = JSON.parse(sessionStorage.getItem('userSession')) || {};
  const { role, userId, userName, userEmail } = sessionData;

  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("home");
  const [activePopup, setActivePopup] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [value, setValue] = useState({ imageSrc: '' });
  const [users, setUsers] = useState([]);
  const [filterListUser, setFilterlistUser] = useState([]);
  const [searchName, setSearchName] = useState('');
  useEffect(() => {
    userInstance.get(`/GetAllUsers`)
      .then((res) => {
        sessionStorage.setItem('originalUserList', JSON.stringify(res?.data?.result));
        setUsers(res?.data?.result);
      })
      .catch((err) => {
        console.log(err.response.data);
      })
  }, [])
  useEffect(() => {
    userInstance.get(`/GetUserById/${userId}`)
      .then((res) => {
        if (res?.data?.result.imageSrc === 'https://localhost:7006/Images/') {
          setValue(defaultImage)
        } else {
          setValue(res?.data?.result.imageSrc)
        }
      })
      .catch((err) => {
        console.log(err.response.data);
      })
  }, [changeImage]);
  const handlePopup = () => {
    setShowPopup(!showPopup);
    setActivePopup(!activePopup);
  };
  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    onItemClick(itemId);
  };
  const handleAvatarClick = (id) => {
    setSearchName('');
    navigate('/profile', { state: { userId: id } });
  };
  const hanldeReturnHome = () => {
    navigate('/home');
  }
  const searchUser = (event) => {
    setSearchName(event.target.value);
    if (event.target.value === '') { // corrected condition
      const originalUsers = JSON.parse(sessionStorage.getItem('originalUserList')) || [];
      // console.log(originalUsers)
      setFilterlistUser(originalUsers);
    } else {
      setFilterlistUser(users.filter(user => user.fullName.toLowerCase().includes(event.target.value.toLowerCase())));
    }
  }
  return (
    <Row id="header" className="m-0">
      <Col className="d-flex align-items-center" sm={4}>
        <Image src={logoImg} className="logo" onClick={() => hanldeReturnHome()} />
        <div className="d-flex search align-items-center position-relative">
          <CiSearch className="" />
          <input type="text" placeholder="Search" value={searchName} className="search-box" onChange={searchUser} />

          <div className={`position-absolute user-box ${searchName === '' ? 'hidden-box' : ''}`} >
            {filterListUser.length > 0 ? (
              filterListUser.map((user) => (
                <div key={user.id} className="d-flex align-items-center" onClick={()=>handleAvatarClick(user.id)}>
                  <img src={user.imageSrc === 'https://localhost:7006/Images/' ? defaultImage : user.imageSrc} style={{ width: '20px', height: '20px' }} alt="" />
                  <div>
                    {user.fullName}
                    {user.email}
                  </div>
                </div>
              ))
            ) : (
              <div>No match item</div>
            )}

          </div>
        </div>
      </Col>
      <Col className="justify-content-center d-flex align-items-center" sm={4}>
        <LuHome
          className={`home-icon ${activeItem === "home" ? "active-header-item" : ""
            }`}
          onClick={() => handleItemClick("home")}
        />
        <IoChatbubblesOutline
          className={`chat-icon ${activeItem === "chat" ? "active-header-item" : ""
            }`}
          onClick={() => handleItemClick("chat")}
        />

        <div >
          <IoIosNotificationsOutline
            className={`notify-icon ${activePopup === true ? "active-header-item" : ""
              }`}
            onClick={() => handlePopup()}
          />
          <Popup trigger={showPopup}>
            <Notify />
          </Popup>
        </div>
      </Col>
      <Col className="d-flex justify-content-end align-items-center" sm={4}>
        <DarkMode />
        <div className=" d-flex align-items-center" onClick={() => handleAvatarClick(userId)}>
          <img src={value} alt="" className="avatar" />
          <div className="ms-2 t-black">
            <p>{userName}</p>
            <p>{userEmail}</p>
          </div>
        </div>
      </Col>
    </Row>
  );
}
