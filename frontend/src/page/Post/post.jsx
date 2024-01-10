import React from "react";
import { useState } from "react";
import "../Post/post.scss";
import { CiCircleChevRight } from "react-icons/ci";
import { LuImagePlus } from "react-icons/lu";
import avatar from "../../images/common/Avatar.png";
import { IoFlagOutline } from "react-icons/io5";
import { BsChat } from "react-icons/bs";
import { FiEye } from "react-icons/fi";
function Post() {
  const [inputValue, setInputValue] = useState("");

  // Handler function to update the state when the input changes
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  return (
    <div id="post">
      <div className="post-form p-2">
        <div className="d-flex align-items-center">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            className="input-text"
            placeholder="Create new Post..."
          />
          <button className="btn">
            <CiCircleChevRight className=" fs-3" />
          </button>
        </div>
        <div>
          <button className="btn image d-flex align-items-center">
            <LuImagePlus className="me-2" />
            Add image
          </button>
        </div>
      </div>
      <div className="post-item mt-2 p-2">
        <div className="d-flex align-items-center">
          <img src={avatar} alt="profile" className="profile" />
          <div className="ms-2">
            <h6 className="mb-0">John Doe</h6>
            <p className="mb-0">10 min ago</p>
          </div>
        </div>
        <p className="mt-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
          voluptates, voluptate, quidem, dolorum quae doloremque exercitationem
          voluptatum quod officiis doloribus quos. Quisquam voluptates,
          voluptate, quidem, dolorum quae doloremque exercitationem voluptatum
          quod officiis doloribus quos.
        </p>
        <div className="d-flex justify-content-between mt-2">
          <div className="d-flex align-items-center">
            <div className="d-flex align-items-center me-3">
              <FiEye className="me-2" /> 12
            </div>
            <div className="d-flex align-items-center me-3">
              <BsChat className="me-2" /> 123
            </div>
            <div className="d-flex align-items-center me-3">
              <IoFlagOutline />{" "}
            </div>
          </div>
          <button className="view-btn btn">View Detail</button>
        </div>
      </div>
    </div>
  );
}

export default Post;
