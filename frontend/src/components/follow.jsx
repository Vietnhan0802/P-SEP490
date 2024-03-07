import React, { useEffect, useState,} from "react";
import "../scss/follow.scss";
import tick from "../images/common/verifiedTick.png";
import { LuDot } from "react-icons/lu";
import { useTranslation } from 'react-i18next';
import { followInstance } from "../axios/axiosConfig";
import defaultImage from "../../src/images/common/default.png";
import { useNavigate } from "react-router-dom";

function Follow({ newFollow }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [following, setFollowing] = useState([]);
  const sessionData = JSON.parse(sessionStorage.getItem("userSession")) || {};
  const { currentUserId } = sessionData;
  useEffect(() => {
    followInstance.get(`GetAllFollowings/${currentUserId}`)
      .then((res) => { setFollowing(res?.data?.result) })
      .catch((error) => { console.error(error) })
  }, [newFollow])
  const handleAvatarclick = (value) => {
    navigate('/profile', { state: { userId: value } });
  }
  return (
    <div className="follow position-relative">
      <div>
        <p className="text">{t('following')}</p>
        {following.map((item) => (
          <div className="follow-user d-flex align-items-center mb-2" key={item.idAccount} onClick={()=>handleAvatarclick(item.idAccount)}>
            <div className="follow-avata-box">
              <img src={item.avatar === "https://localhost:7006/Images/" ? defaultImage : item.avatar} alt="user" className="user-image" />
              <img src={tick} alt="tick" className="user-tick" />
            </div>
            <div className="follow-user-info ms-2">
              <p className="follow-user-name fw-bold">{item.fullName}</p>
              <p className="follow-user-email">{item.email}</p>
            </div>
          </div>))}
      </div>

      <button className="btn border mt-3 fw-bold">
        <LuDot className="me-1 dot fs-3" />
        {t('viewfollow')}
      </button>
    </div>
  );
}

export default Follow;
