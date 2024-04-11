import React, { useEffect } from "react";
import { useState } from "react";
import defaultImage from "../../images/common/default.png";
import "../Notify/notify.scss";
import { formatDistanceToNow, parseISO } from 'date-fns';
import { notifyInstance } from "../../axios/axiosConfig";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { FaLessThanEqual } from "react-icons/fa";
function Notify({ close, resetNoti, currentUserId,numberUnreadNoti }) {
  const { t } = useTranslation()
  const navigate = useNavigate();
  const [reset, setReset] = useState(false);
  const [unreadNum, setUnread] = useState('');
  function formatTimeAgo(dateString) {
    const result = formatDistanceToNow(parseISO(dateString), { addSuffix: true });
    // Loại bỏ từ "about" khỏi chuỗi
    return result.replace("about ", "");
  }
  const [notifications, setNotifications] = useState([]);
  const [filterNotifications, setFilterNotifications] = useState([]);

  useEffect(() => {
    notifyInstance.get(`GetNotificationByUser/${currentUserId}`)
      .then((res) => {
        const formattedNotifi = res.data.map(notifications => {
          return {
            ...notifications,
            timeAgo: formatTimeAgo(notifications.createdDate),
          };
        });
        numberUnreadNoti(formattedNotifi.filter((item)=> item.isRead === false).length);
        setNotifications(formattedNotifi);
        setFilterNotifications(formattedNotifi);
      })
      .catch((error) => {
        console.error(error);
      })
  }, [currentUserId, reset, resetNoti]);
  function getContent(contentKey) {
    switch (contentKey) {
      case 'content_notifollow':
        return t('content_notifollow');
      case 'content_notipostlike':
        return t('content_notipostlike');
      case 'content_notipostcomment':
        return t('content_notipostcomment');
      case 'content_notipostreply':
        return t('content_notipostreply');
      case 'content_notiblog':
        return t('content_notiblog');
      case 'content_notiprojectapply':
        return t('content_notiprojectapply');
      case 'content_notiprojectinvite':
        return t('content_notiprojectinvite');
      default:
        return t('unknown_content');
    }
  }

  const handleNotifiClick = (idNotification, id, url, idUrl) => {
    notifyInstance.put(`ReadNotification/${idNotification}`)
      .then((res) => {
        const updateNotifi = filterNotifications.map(notify => {
          if (notify.idNotification === idNotification) {
            return { ...notify, isRead: true };
          }
          return notify;
        });
        close();
        setFilterNotifications(updateNotifi);
        switch (url) {
          case 'Follow':
            return navigate('/profile', { state: { userId: id } });
          case 'PostComment':
          case 'PostLike':
          case 'PostReply':
            return navigate('/postdetail', { state: { idPost: idUrl } });
          case 'BlogComment':
          case 'BlogLike':
          case 'BlogReply':
            return navigate('/blogdetail', { state: { idBlog: idUrl } });
          case 'ProjectInvite':
            return navigate('/invitation', { state: { activeItem: 'invitation' } });
          case 'ProjectApply':
            return navigate('/projectapplication', { state: { activeItem: 'projectapplication' } });
          default:
            return;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleViewUnread = () => {
    setFilterNotifications(notifications.filter((item) => { return item.isRead === false; }));

  }
  const handleViewAll = () => {
    setFilterNotifications(notifications);
  }
  return (
    <div
      md={6}
      className="bg-white notify-cover p-3"
      style={{ width: "470px", height: "760px" }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <h2 className="mb-2">{t('title_noti')}</h2>
          <button className="btn btn-outline-secondary me-3" onClick={handleViewAll}>{t('viewnoti')}</button>
          <button className="btn btn-outline-secondary" onClick={handleViewUnread}>{t('notread')}</button>
        </div>
      </div>
      <div className="mt-3">
        {filterNotifications.map((item) => (
          <div className="d-flex align-items-center justify-content-between py-3 notification-item" onClick={() => handleNotifiClick(item.idNotification, item.idSender, item.url, item.idUrl)}>
            <div className="d-flex align-items-center" key={item.idNotification}>
              <img src={item.avatar === "https://localhost:7006/Images/" ? defaultImage : item.avatar} alt="profile" className="profile" />
              <div className="ms-2 content">
                <p className="mb-0">
                  <span className="fw-bold">{item.nameSender}</span>{item.count === null || 0 ? `${getContent(item.content)}` : ` ${t('and')} ${item.count} ${t('people')} ${getContent(item.content)}`}
                </p>
                <p className={`mb-0 date ${item.isRead === false ? "notRead" : "read"
                  }`}>{item.timeAgo}</p>
              </div>
              <div className={`${item.isRead === false ? "notify-dot" : "read-dot"
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
