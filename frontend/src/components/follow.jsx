import React from "react";
import "../scss/follow.scss";
import avatar from "../images/common/Avatar.png";
import tick from "../images/common/verifiedTick.png";
import { LuDot } from "react-icons/lu";
function Follow() {
  return (
    <div className="follow position-relative">
      <div>
        <p className="text">You are following</p>
        <div className="follow-user d-flex align-items-center">
          <div className="follow-avata-box">
            <img src={avatar} alt="user" className="user-image" />
            <img src={tick} alt="tick" className="user-tick"/>
          </div>
          <div className="follow-user-info">
            <p className="follow-user-name fw-bold">Luna Verse</p>
            <p className="follow-user-email">Lorem ipsum dolor sit amet</p>
          </div>
        </div>
        <div className="follow-user d-flex align-items-center mt-2">
          <div>
            <img src={avatar} alt="user" className="user-image" />
          </div>
          <div className="follow-user-info">
            <p className="follow-user-name fw-bold">Luna Verse</p>
            <p className="follow-user-email">Lorem ipsum dolor sit amet</p>
          </div>
        </div>
        <div className="follow-user d-flex align-items-center mt-2">
          <div>
            <img src={avatar} alt="user" className="user-image" />
          </div>
          <div className="follow-user-info">
            <p className="follow-user-name fw-bold">Luna Verse</p>
            <p className="follow-user-email">Lorem ipsum dolor sit amet</p>
          </div>
        </div>
      </div>

      <button className="btn border mt-3 fw-bold position-absolute ">
        <LuDot className="me-1 dot fs-3" />
        View all
      </button>
    </div>
  );
}

export default Follow;
