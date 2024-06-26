import React, { useEffect, useState, } from "react";
import "../scss/follow.scss";
import tick from "../images/common/verifiedTick.png";
import { LuDot } from "react-icons/lu";
import { useTranslation } from 'react-i18next';
import defaultImage from "../../src/images/common/default.png";
import { useNavigate } from "react-router-dom";

function Follow({ followValue }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [following, setFollowing] = useState([]);


  useEffect(() => {
    setFollowing(followValue)
  }, [followValue])
  const handleAvatarclick = (value) => {
    navigate('/profile', { state: { userId: value } });
  }
  return (
    <div className="follow position-relative">
      <div>
        <p className="text">{t('following')}</p>
        <div className={`follow-list ${following?.length > 10 ? 'follow-scroll' : ''}`}>
          {following?.length > 0 ? following?.map((item) => (
            <div className="follow-user d-flex align-items-center mb-2" key={item.idAccount} onClick={() => handleAvatarclick(item.idAccount)}>
              <div className="follow-avata-box">
                <img src={item.avatarAccount} alt="user" className="user-image" />
                {item.isVerifiedAccount && <img src={tick} alt="tick" className="user-tick" />}
              </div>
              <div className="follow-user-info ms-2">
                <p className="follow-user-name fw-bold">{item.fullNameAccount}</p>
                <p className="follow-user-email">{item.emailAccount}</p>
              </div>
            </div>)) : <p>You are not following anyone yet!</p>}
        </div>

      </div>
      {following?.length > 10 ?
        <button className="btn border mt-3 fw-bold">
          <LuDot className="me-1 dot fs-3" />
          {t('viewfollow')}
        </button> : ''}

    </div>
  );
}

export default Follow;
