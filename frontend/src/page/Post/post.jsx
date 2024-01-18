import React from "react";
import { useState } from "react";
import "../Post/post.scss";
import { CiCircleChevRight } from "react-icons/ci";
import { LuImagePlus } from "react-icons/lu";
import avatar from "../../images/common/Avatar.png";
import { IoFlagOutline } from "react-icons/io5";
import { BsChat } from "react-icons/bs";
import { FiEye } from "react-icons/fi";
import ReportPopup from "../../components/Popup/reportPopup";
import Img1 from "../../images/common/post-img-1.png";
import Img2 from "../../images/common/post-img-2.png";
function Post({postId,onPostClick,activeItem, onItemClick }) {
  const postContent = [
    {
      id: 1,
      name: "Admin",
      // img: <RiAdminLine />,
      time: "10 minutes ago",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptates, voluptate, quidem, dolorum quae doloremque exercitationem voluptatum quod officiis doloribus quos. Quisquam voluptates, voluptate, quidem, dolorum quae doloremque exercitationem voluptatum quod officiis doloribus quos.",
      view: 12,
      comment: 123,
    },
    {
      id: 2,
      name: "Admin",
      // img: <RiAdminLine />,
      time: "10 minutes ago",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptates, voluptate, quidem, dolorum quae doloremque exercitationem voluptatum quod officiis doloribus quos. Quisquam voluptates, voluptate, quidem, dolorum quae doloremque exercitationem voluptatum quod officiis doloribus quos.",
      view: 12,
      comment: 123,
    },
    {
      id: 3,
      name: "Admin",
      // img: <RiAdminLine />,
      time: "10 minutes ago",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptates, voluptate, quidem, dolorum quae doloremque exercitationem voluptatum quod officiis doloribus quos. Quisquam voluptates, voluptate, quidem, dolorum quae doloremque exercitationem voluptatum quod officiis doloribus quos.",
      view: 12,
      comment: 123,
    },
    {
      id: 4,
      name: "Admin",
      // img: <RiAdminLine />,
      time: "10 minutes ago",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptates, voluptate, quidem, dolorum quae doloremque exercitationem voluptatum quod officiis doloribus quos. Quisquam voluptates, voluptate, quidem, dolorum quae doloremque exercitationem voluptatum quod officiis doloribus quos.",
      view: 12,
      comment: 123,
    },
    {
      id: 5,
      name: "Admin",
      // img: <RiAdminLine />,
      time: "10 minutes ago",
      content:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam voluptates, voluptate, quidem, dolorum quae doloremque exercitationem voluptatum quod officiis doloribus quos. Quisquam voluptates, voluptate, quidem, dolorum quae doloremque exercitationem voluptatum quod officiis doloribus quos.",
      view: 12,
      comment: 123,
    },
  ];
  const [inputValue, setInputValue] = useState("");
  const [blogPopups, setBlogPopups] = useState({});
  const hanldeViewDetail = (postId) => {
    onPostClick(postId);
    onItemClick("post_detail");
  }
  const handleReportClick = (postId) => {
    setBlogPopups((prev) => ({ ...prev, [postId]: true }));
  };
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
      {postContent.map((item) => (
        <div
          key={item.id}
          className={`post-item mt-2 p-2 ${
            blogPopups[item.id] ? "position-relative" : ""
          }`}
        >
          <div className="d-flex align-items-center">
            <img src={avatar} alt="profile" className="profile" />
            <div className="ms-2">
              <h6 className="mb-0">{item.name}</h6>
              <p className="mb-0">{item.time}</p>
            </div>
          </div>
          <div className="d-flex ">
            <img src={Img1} alt="post-img" className="w-50 " />
            <img src={Img2} alt="post-img" className="w-50 ps-1" />
          </div>
          <p className="mt-2">{item.content}</p>
          <div className="d-flex justify-content-between mt-2">
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center me-3">
                <FiEye className="me-2" /> {item.view}
              </div>
              <div className="d-flex align-items-center me-3">
                <BsChat className="me-2" /> {item.comment}
              </div>
              <div
                className="d-flex align-items-center me-3"
                onClick={() => handleReportClick(item.id)}
              >
                <IoFlagOutline />{" "}
              </div>
            </div>
            <button className="view-btn btn" onClick={()=>hanldeViewDetail(item.id)}>View Detail</button>
          </div>
          {blogPopups[item.id] && (
            <ReportPopup
              trigger={blogPopups[item.id]}
              setTrigger={(value) =>
                setBlogPopups((prev) => ({ ...prev, [item.id]: value }))
              }
            >
              <div className="bg-white h-100 post-report">
                <h3 className="text-center border-bottom pb-2">Report</h3>
                <p>
                  <b>Please fill in your feedback</b>
                </p>
                <textarea
                  type="text"
                  placeholder="What's wrong with this post"
                  className="w-100 p-3"
                />
                <div className="d-flex justify-content-end mt-2">
                  <button className="btn btn-secondary ">Submit</button>
                </div>
              </div>
            </ReportPopup>
          )}
        </div>
      ))}
    </div>
  );
}

export default Post;
