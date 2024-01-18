import React from "react";
import "./popup.scss";
import { IoCloseOutline } from "react-icons/io5";
function ProfileReport(props) {
  return props.trigger ? (
    <div id="profile-report">
      <div className="popup">
        <button className="close-btn" onClick={() => props.setTrigger(false)}>
          <IoCloseOutline />
        </button>
        <div className="popup-inner">
          {props.children}
          
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}

export default ProfileReport;
