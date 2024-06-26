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
import defaultImage from "../images/common/default.png";
import Popup from "./Popup/Popup";
import Notify from "../page/Notify/notify";
import DarkMode from "./darkmode";
import Translate from "./translate";
import { userInstance } from "../axios/axiosConfig";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import tick from "../images/common/verifiedTick.png";
export default function Header({
  valuePopup,
  activeComponent,
  onItemClick,
  changeImage,
  changeThemeHeader,
  resetPopup,
}) {
  const { t } = useTranslation();
  const location = useLocation(); // Get the current location
  const sessionData = JSON.parse(sessionStorage.getItem("userSession")) || {};
  const { currentUserId } = sessionData;
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("home");
  const [activePopup, setActivePopup] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [value, setValue] = useState({});
  const [users, setUsers] = useState([]);
  const [filterListUser, setFilterlistUser] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [notiCount, setNotiCount] = useState();

  useEffect(() => {
    // Check if the current URL is '/chat'
    if (location.pathname === "/chat") {
      // Do something if URL is '/chat'
      handleItemClick("chat");
    }
  }, [location.pathname]); // Re-run the effect when the location.pathname changes
  useEffect(() => {
    setShowPopup(false);
    setActivePopup(false);
  }, [resetPopup]);
  useEffect(() => {
    userInstance
      .get(`/GetAllUsers`)
      .then((res) => {
        sessionStorage.setItem(
          "originalUserList",
          JSON.stringify(res?.data?.result)
        );
        setUsers(res?.data?.result);
      })
      .catch((err) => {
        console.log(err?.response?.data);
      });
  }, []);
  useEffect(() => {
    userInstance
      .get(`/GetUserById/${currentUserId}`)
      .then((res) => {
        setValue(res?.data?.result);
        if (res?.data?.result.imageSrc === "https://localhost:7006/Images/") {
          setValue((prev) => ({ ...prev, imageSrc: defaultImage }));
        } else {
          setValue((prev) => ({
            ...prev,
            imageSrc: res?.data?.result?.imageSrc,
          }));
        }
      })
      .catch((err) => {
        console.log(err?.response?.data);
      });
  }, [changeImage, currentUserId]);
  const handlePopup = () => {
    setShowPopup(!showPopup);
    setActivePopup(!activePopup);
  };

  const handleItemClick = (itemId) => {
    setShowPopup(false);
    setActivePopup(false);
    setActiveItem(itemId);
    onItemClick(itemId);
  };
  const handleAvatarClick = (id) => {
    setShowPopup(false);
    setActivePopup(false);
    setSearchName("");
    setActiveItem(id);
    onItemClick(id);
    navigate("/profile", { state: { userId: id } });
  };
  const hanldeReturnHome = (itemId) => {
    setShowPopup(false);
    setActivePopup(false);
    setActiveItem(itemId);
    onItemClick(itemId);
    navigate("/post", { state: { activeItem: "post" } });
  };
  const searchUser = (event) => {
    setSearchName(event.target.value);
    if (event.target.value === "") {
      // corrected condition
      const originalUsers =
        JSON.parse(sessionStorage.getItem("originalUserList")) || [];
      // console.log(originalUsers)
      setFilterlistUser(originalUsers);
    } else {
      setFilterlistUser(
        users.filter(
          (user) =>
            user.fullName
              .toLowerCase()
              .includes(event.target.value.toLowerCase()) ||
            user.email.toLowerCase().includes(event.target.value.toLowerCase())
        )
      );
    }
  };
  const close = () => {
    setShowPopup((prev) => !prev);
    setActivePopup((prev) => !prev);
  };
  const changeTheme = (value) => {
    console.log(value);
    changeThemeHeader(value);
  };
  const numberUnreadNoti = (value) => {
    setNotiCount(value);
  };
  return (
    <Row id="header" className="m-0">
      <Col className="d-flex align-items-center" sm={4}>
        <Image
          src={logoImg}
          className="logo"
          onClick={() => hanldeReturnHome("home")}
        />
        <div className="d-flex search align-items-center position-relative w-50">
          <CiSearch className="" />
          <input
            type="text"
            placeholder={t("search")}
            value={searchName}
            className="search-box w-100"
            onChange={searchUser}
          />

          <div
            className={`position-absolute w-100 form-control overflow-hidden user-box ${
              searchName === "" ? "hidden-box" : ""
            }`}
            style={{ textOverflow: "ellipsis" }}
          >
            {filterListUser.length > 0 ? (
              filterListUser.map((user) => (
                <div
                  key={user.id}
                  className="d-flex align-items-center my-2"
                  onClick={() => handleAvatarClick(user.id)}
                >
                  <div className="position-relative">
                    <img
                      src={user.imageSrc}
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                      }}
                      alt=""
                    />
                    {user.isVerified && (
                      <img
                        src={tick}
                        alt="tick"
                        className="position-absolute bottom-0 end-0"
                        style={{ width: "18px" }}
                      />
                    )}
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
        <div>
          <LuHome
            className={`home-icon ${
              activeItem === "home" ? "active-header-item" : ""
            }`}
            onClick={() => hanldeReturnHome("home")}
          />
        </div>
        <div>
          <IoChatbubblesOutline
            className={`chat-icon ${
              activeItem === "chat" ? "active-header-item" : ""
            }`}
            onClick={() => handleItemClick("chat")}
          />
        </div>

        <div>
          <div className="position-relative">
            <IoIosNotificationsOutline
              className={`notify-icon ${
                activePopup === true ? "active-header-item" : ""
              }`}
              onClick={() => handlePopup()}
            />
            {/* <p className="position-absolute unread-count ">
            <span>
              {notiCount}
            </span>
            </p> */}
          </div>

          <Popup trigger={showPopup}>
            <Notify
              close={close}
              resetNoti={showPopup}
              currentUserId={currentUserId}
              numberUnreadNoti={numberUnreadNoti}
            />
          </Popup>
        </div>
      </Col>
      <Col className="d-flex justify-content-end align-items-center" sm={4}>
        {/* <Translate /> */}
        <DarkMode changeTheme={changeTheme} />
        <div
          className=" d-flex align-items-center"
          onClick={() => handleAvatarClick(currentUserId)}
        >
          <div className="position-relative">
            <div
              className="profile"
              style={{ width: "45px", height: "45px", borderRadius: "50%" }}
            >
              <img src={value.imageSrc} alt="" />
            </div>

            {value.isVerified && (
              <img
                src={tick}
                alt="tick"
                className="position-absolute bottom-0 end-0"
                style={{ width: "18px" }}
              />
            )}
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
