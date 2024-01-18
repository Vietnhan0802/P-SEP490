import React from "react";
import "./popup.scss"
function Popup(props) {
  return props.trigger ? (
    <div id="simplePopup">
      <div className="popup">
        <div className="popup-inner">
          {props.children}
        </div>
      </div>
    </div>
  ) : (
    ""
  );
}

export default Popup;
