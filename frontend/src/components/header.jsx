import React, { useEffect } from "react";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../scss/header.scss";
import { Row, Col, Image, Popover } from "react-bootstrap";
import { CiSearch } from "react-icons/ci";
import { LuHome } from "react-icons/lu";
import logoImg from "../images/common/logo.png";
import { IoChatbubblesOutline } from "react-icons/io5";
import { IoIosNotificationsOutline } from "react-icons/io";
import defaultImage from "../images/common/default.png"
import Popup from "./Popup/Popup";
import Notify from "../page/Notify/notify";
import DarkMode from "./darkmode";
import Translate from "./translate";
import { userInstance } from "../axios/axiosConfig";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import tick from "../images/common/verifiedTick.png";
export default function Header({ activeComponent, onItemClick, changeImage }) {
  const { t } = useTranslation()
  const sessionData = JSON.parse(sessionStorage.getItem('userSession')) || {};
  const { currentUserId } = sessionData;
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("home");
  const [activePopup, setActivePopup] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [value, setValue] = useState({});
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
    userInstance.get(`/GetUserById/${currentUserId}`)
      .then((res) => {
        setValue(res?.data?.result)
        if (res?.data?.result.imageSrc === 'https://localhost:7006/Images/') {
          setValue((prev) => ({ ...prev, imageSrc: defaultImage }));
        } else {
          setValue((prev) => ({ ...prev, imageSrc: res?.data?.result?.imageSrc }));
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
    navigate('/post', { state: { activeItem: 'post' } });
  }
  const searchUser = (event) => {
    setSearchName(event.target.value);
    if (event.target.value === '') { // corrected condition
      const originalUsers = JSON.parse(sessionStorage.getItem('originalUserList')) || [];
      // console.log(originalUsers)
      setFilterlistUser(originalUsers);
    } else {
      setFilterlistUser(users.filter(
        user => user.fullName.toLowerCase().includes(event.target.value.toLowerCase())
          || user.email.toLowerCase().includes(event.target.value.toLowerCase())
      ));
    }
  }
  return (
    <Row id="header" className="m-0">
      <Col className="d-flex align-items-center" sm={4}>
        <Image src={logoImg} className="logo" onClick={() => hanldeReturnHome()} />
        <div className="d-flex search align-items-center position-relative w-50">
          <CiSearch className="" />
          <input type="text" placeholder={t('search')} value={searchName} className="search-box w-100" onChange={searchUser} />

          <div className={`position-absolute w-100 form-control overflow-hidden user-box ${searchName === '' ? 'hidden-box' : ''}`} style={{ textOverflow: 'ellipsis' }} >
            {filterListUser.length > 0 ? (
              filterListUser.map((user) => (
                <div key={user.id} className="d-flex align-items-center my-2" onClick={() => handleAvatarClick(user.id)}>
                  <div className="position-relative">
                    <img src={user.imageSrc} style={{ width: '50px', height: '50px' }} alt="" />
                    {user.isVerified && <img src={tick} alt="tick" className="position-absolute bottom-0 end-0" style={{ width: '18px' }} />}
                  </div>
                  <div className="ms-2">
                    <p>{user.fullName}</p>
                    <p>{user.email}</p>
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
          onClick={() => hanldeReturnHome()}
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
        <Translate />
        <DarkMode />
        <div className=" d-flex align-items-center" onClick={() => handleAvatarClick(currentUserId)}>
          <div className="position-relative">
            <img src={value.imageSrc} style={{ width: '50px', height: '50px' }} alt="" />
            {value.isVerified && <img src={tick} alt="tick" className="position-absolute bottom-0 end-0" style={{ width: '18px' }} />}
          </div>
          <div className="ms-2 t-black">
            <p>{value.fullName}</p>
            <p>{value.email}</p>
          </div>
        </div>
      </Col>
    </Row>
  );
}
