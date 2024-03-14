import React, { useEffect } from "react";
import { useState } from "react";
import "../OwnPost/ownpost.scss";
import { CiSearch } from "react-icons/ci";
import { BsChat } from "react-icons/bs";
import { IoFlagOutline } from "react-icons/io5";
import { FiEye } from "react-icons/fi";
import ReportPopup from "../../components/Popup/reportPopup";
import defaultAvatar from "../../images/common/default.png"

import { postInstance, reportInstance } from "../../axios/axiosConfig"
import PostPu from "./postPu";
function calculateTimeDifference(targetDate) {
  // Convert the target date string to a Date object
  const targetTime = new Date(targetDate).getTime();

  // Get the current time
  const currentTime = new Date().getTime();

  // Calculate the difference in milliseconds
  const timeDifference = currentTime - targetTime;

  // Calculate the difference in seconds, minutes, hours, and days
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // Return an object with the time difference values
  if (minutes < 60) {
    return minutes === 1 ? `${minutes} minute ago` : `${minutes} minutes ago`;
  } else if (hours < 24) {
    return hours === 1 ? `${hours} hour ago` : `${hours} hours ago`;
  } else {
    return days === 1 ? `${days} day ago` : `${hours} days ago`;
  }
}
function OwnPost({ postId, onPostClick, activeItem, onItemClick }) {
  const sessionData = JSON.parse(sessionStorage.getItem('userSession')) || {};
  const { currentUserId } = sessionData;

  const [blogPopups, setBlogPopups] = useState({});
  const [postList, setPostList] = useState([])
  const [resetPage, setResetPage] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const createData = (id, createdDate, avatar, title, content, view, like, viewPostImages, fullName) => {
    return {
      id, createdDate, avatar, title, content, view, like, viewPostImages, fullName
    }
  }

  const handlePopupContent = (event, postId) => {
    setPopupContent((prev) => ({ ...prev, [postId]: event.target.value }));
    console.log(popupContent)
  }
  const handleCreateReport = (userId, postId, content) => {
    reportInstance.post(`/CreatePostReport/${userId}/${postId}/${content}`)
      .then((res) => { console.log(res?.data?.result) })
      .catch((error) => { console.error(error) });
  }

  useEffect(() => {
    postInstance.get(`GetPostByUser/${currentUserId}`)
      .then((res) => {
        const postList = res?.data?.result;
        setPostList([]);
        postList.map((element) => {
          const time = calculateTimeDifference(element.createdDate);
          setPostList((prevData) => ([
            ...prevData,
            createData(
              element.idPost,
              time,
              element.avatar,
              element.title,
              element.content,
              element.view,
              element.like,
              element.viewPostImages,
              element.fullName)
          ]));
        })
      })
      .catch((error) => { console.error(error) });
  }, [resetPage]);
  const hanldeViewDetail = (postId) => {
    onPostClick(postId);
    onItemClick("post_detail");
  }
  const handleReportClick = (postId) => {
    setBlogPopups((prev) => ({ ...prev, [postId]: true }));
  };
  const reset =(value)=>{
    if(value){
      setResetPage(value)
    }
  }
  return (
    <div id="own_post">
      
      <div className="bg-white blog-form p-2 d-flex flex-grid align-items-center justify-content-between row m-0" style={{borderRadius:'8px'}}>
          <div className="d-flex blog-search align-items-center position-relative col me-2">
            <CiSearch className="" />
            <input
              type="text"
              placeholder={"Search"}
              className="search-box size-20"
            />
          </div>
          <div className="d-flex flex-row align-items-center col-auto m-md-0-cus mt-2 p-0">
          <PostPu reset={reset} />
            <button type="button" className="btn btn-info text-white">
              Trend
            </button>
          </div>
        </div>
      {postList.map((item) => (
        <div
          key={item.idPost}
          className={`post-item p-2 ${blogPopups[item.id] ? "position-relative" : ""
            }`}
        >
          <div className="d-flex align-items-center">
            <img src={item.avatar === 'https://localhost:7006/Images/' ? defaultAvatar : item.avatar} alt="profile" className="profile" />
            <div className="ms-2">
              <h6 className="mb-0">{item.fullName}</h6>
              <p className="mb-0">{item.createdDate}</p>
            </div>
          </div>
          <h4 className="mt-2">{item.title}</h4>

          <p className="mt-2" style={{ whiteSpace: 'pre-wrap' }}>{item.content}</p>

          <div className="d-flex ">
            {item.viewPostImages?.map(items => (
              <img src={items.imageSrc} alt="" className="w-50 p-2" />
            ))}
          </div>
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
            <button className="view-btn btn" onClick={() => hanldeViewDetail(item.id)}>View Detail</button>
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
                  value={popupContent[item.id]}
                  className="w-100 p-3"
                  onChange={(event) => handlePopupContent(event, item.id)}
                />
                <div className="d-flex justify-content-end mt-2">
                  <button className="btn btn-secondary "
                    onClick={() => handleCreateReport(currentUserId, item.id, popupContent[item.id])}>Submit</button>
                </div>
              </div>
            </ReportPopup>
          )}
        </div>
      ))}
    </div>
  )
}

export default OwnPost
