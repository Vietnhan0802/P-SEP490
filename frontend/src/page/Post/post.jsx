import React from "react";
import { useState } from "react";
import "../Post/post.scss";
import { CiCircleChevRight } from "react-icons/ci";
import { LuImagePlus } from "react-icons/lu";
function Post() {
  const [inputValue, setInputValue] = useState("");

  // Handler function to update the state when the input changes
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  return (
    <div className="post">
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
        <button className="btn image d-flex align-items-center"><LuImagePlus className="me-2"/>Add image</button>
      </div>
    </div>
  );
}

export default Post;
