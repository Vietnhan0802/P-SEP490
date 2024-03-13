import React, { useEffect } from "react";
import { useState } from "react";
import defaultImage from "../../images/common/default.png";
import "../Notify/notify.scss";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { notifyInstance } from "../../axios/axiosConfig";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
function Notify() {
  const {t} = useTranslation()
  const navigate = useNavigate();

  const sessionData = JSON.parse(sessionStorage.getItem("userSession")) || {};
  const { currentUserId } = sessionData;

  function formatTimeAgo(dateString) {
    const result = formatDistanceToNow(parseISO(dateString), { addSuffix: true });
    // Loại bỏ từ "about" khỏi chuỗi
    return result.replace("about ", "");
  }

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    notifyInstance.get(`GetNotificationByUser/${currentUserId}`)
    .then((res) => {
      const formattedNotifi = res.data.map(notifications => {
        return {
          ...notifications,
          timeAgo: formatTimeAgo(notifications.createdDate),
        };
      });
      setNotifications(formattedNotifi);
    })
    .catch((error) => {
      console.error(error);
    })
  }, [currentUserId]);

  // const hanldeViewDetail = (postId) => {
  //   onPostClick(postId);
  //   onItemClick("post_detail");
  // };
console.log(notifications)
  const handleNotifiClick = (idNotification, id, url, idPost) => {
    notifyInstance.put(`ReadNotification/${idNotification}`)
    .then((res) => {
      const updateNotifi = notifications.map(notify => {
        if (notify.idNotification === idNotification) {
          return {...notify, isRead: true};
        }
        return notify;
      });
      setNotifications(updateNotifi);
      if (url === 'Follow') {
        navigate('/profile', { state: { userId: id } });
      }
      else if(url ==="PostComment") {

      }
    })
    .catch((error) => {
      console.error(error);
    });
  };

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
          <div className="d-flex align-items-center justify-content-between py-3 notification-item" onClick={()=>handleNotifiClick(item.idNotification, item.idSender, item.url, item.idPost)}>
            <div className="d-flex align-items-center" key={item.idNotification}>
              <img src={item.avatar === "https://localhost:7006/Images/" ? defaultImage : item.avatar} alt="profile" className="profile" />
              <div className="ms-2 content">
                <p className="mb-0">
                  <span className="fw-bold">{item.nameSender}</span> {item.content === 'content_noti' ? t('content_noti') : t('content_notipost')}
                </p>
                <p className={`mb-0 date ${
                  item.isRead === false ? "notRead" : "read"
                }`}>{item.timeAgo}</p>
              </div>
              <div className={`${
                  item.isRead === false ? "notify-dot" : "read-dot"
                }`}>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notify;
