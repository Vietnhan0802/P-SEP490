import React, { useEffect } from "react";
import { useState } from "react";
import Nolan from "../../images/chat/Nolan.png";
import Angel from "../../images/chat/Angel.png";
import Davis from "../../images/chat/Davis.png";
import Desirae from "../../images/chat/Desirae.png";
import Ryan from "../../images/chat/Ryan.png";
import Roger from "../../images/chat/Roger.png";
import Carla from "../../images/chat/Carla.png";
import Brandon from "../../images/chat/Brandon.png";
import defaultImage from "../../images/common/default.png";
import "../Notify/notify.scss";
import { notifyInstance } from "../../axios/axiosConfig";
import { useTranslation } from 'react-i18next';
function Notify() {
  const {t} = useTranslation()

  const sessionData = JSON.parse(sessionStorage.getItem("userSession")) || {};
  const { currentUserId } = sessionData;
  //const { userId } = location.state || {};
  // const chatList = [
  //   {
  //     id: 1,
  //     name: "Nolan Bator",
  //     img: Nolan,
  //     status: "seen",
  //     text: "check out the all new dashboard view. Pages and exports now load faster.",
  //     time: "10 minutes ago",
  //   },
  //   {
  //     id: 2,
  //     name: "Angel Mango",
  //     img: Angel,
  //     status: "seen",
  //     text: "check out the all new dashboard view. Pages and exports now load faster.",
  //     time: "2 days ago",
  //   },
  //   {
  //     id: 3,
  //     name: "Davis Rhiel",
  //     img: Davis,
  //     status: "unseen",
  //     text: "check out the all new dashboard view. Pages and exports now load faster.",
  //     time: "3 days ago",
  //   },
  //   {
  //     id: 4,
  //     name: "Desirae Lubin",
  //     img: Desirae,
  //     status: "seen",
  //     text: "check out the all new dashboard view. Pages and exports now load faster.",
  //     time: "5 days ago",
  //   },
  //   {
  //     id: 5,
  //     name: "Ryan Dokidis",
  //     img: Ryan,
  //     status: "unseen",
  //     text: "check out the all new dashboard view. Pages and exports now load faster.",
  //     time: "1 hours ago",
  //   },
  //   {
  //     id: 6,
  //     name: "Roger Stanton",
  //     img: Roger,
  //     status: "seen",
  //     text: "check out the all new dashboard view. Pages and exports now load faster.",
  //     time: "3 days ago",
  //   },
  //   {
  //     id: 7,
  //     name: "Carla Septimus",
  //     img: Carla,
  //     status: "seen",
  //     text: "check out the all new dashboard view. Pages and exports now load faster.",
  //     time: "12 hours ago",
  //   },
  //   {
  //     id: 8,
  //     name: "Brandon Philips",
  //     img: Brandon,
  //     status: "unseen",
  //     text: "check out the all new dashboard view. Pages and exports now load faster.",
  //     time: "10 minutes ago",
  //   },
  // ];

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    notifyInstance.get(`GetNotificationByUser/${currentUserId}`)
    .then((res) => {
      setNotifications(res.data)
      console.log(res.data);
    })
    .catch((error) => {
      console.error(error);
    })
  }, []);

  return (
    <div
      md={6}
      className="bg-white notify-cover p-3"
      style={{ width: "470px", height: "760px" }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h2 className="mb-2">{t('title_noti')}</h2>
          <button className="btn btn-outline-secondary me-3">{t('viewnoti')}</button>
          <button className="btn btn-outline-secondary">{t('notread')}</button>
        </div>
      </div>
      <div className="mt-3">
        {notifications.map((item) => (
          <div
            className={`d-flex align-items-center justify-content-between py-3 chat-item ${
              item.status === "unseen" ? "active" : ""
            }`}
          >
            <div className="d-flex align-items-center" key={item.idNotification}>
              <img src={item.avatar === "https://localhost:7006/Images/" ? defaultImage : item.avatar} alt="profile" className="profile" />
              <div className="ms-2 content">
                <p className="mb-0">
                  <span className="fw-bold">{item.nameSender}</span> {t(`${item.content}`)}
                </p>
                <p className="mb-0 date">{item.createdDate}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notify;
