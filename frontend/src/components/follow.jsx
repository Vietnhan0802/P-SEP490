import React from "react";
import "../scss/follow.scss";
import avatar from "../images/common/Avatar.png";
import tick from "../images/common/verifiedTick.png";
import { LuDot } from "react-icons/lu";
import { useTranslation } from 'react-i18next';
function Follow() {
  const {t} = useTranslation()
  return (
    <div className="follow position-relative">
      <div>
        <p className="text">{t('following')}</p>
        <div className="follow-user d-flex align-items-center mb-2">
          <div className="follow-avata-box">
            <img src={avatar} alt="user" className="user-image" />
            <img src={tick} alt="tick" className="user-tick" />
          </div>
          <div className="follow-user-info ms-2">
            <p className="follow-user-name fw-bold">Luna Verse</p>
            <p className="follow-user-email">Lorem ipsum dolor sit amet</p>
          </div>
        </div>
        <div className="follow-user d-flex align-items-center mb-2">
          <div className="follow-avata-box">
            <img src={avatar} alt="user" className="user-image" />
            <img src={tick} alt="tick" className="user-tick" />
          </div>
          <div className="follow-user-info ms-2">
            <p className="follow-user-name fw-bold">Luna Verse</p>
            <p className="follow-user-email">Lorem ipsum dolor sit amet</p>
          </div>
        </div>
        <div className="follow-user d-flex align-items-center mb-2">
          <div className="follow-avata-box">
            <img src={avatar} alt="user" className="user-image" />
            <img src={tick} alt="tick" className="user-tick" />
          </div>
          <div className="follow-user-info ms-2">
            <p className="follow-user-name fw-bold">Luna Verse</p>
            <p className="follow-user-email">Lorem ipsum dolor sit amet</p>
          </div>
        </div>
      </div>

      <button className="btn border mt-3 fw-bold">
        <LuDot className="me-1 dot fs-3" />
        {t('viewfollow')}
      </button>
    </div>
  );
}

export default Follow;
