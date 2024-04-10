import React, { useEffect, useRef } from "react";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min";
import { useState } from "react";
import "../Post/post.scss";
import { IoFlagOutline } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { FiEye } from "react-icons/fi";
import tick from "../../images/common/verifiedTick.png";
import {
  postInstance,
  projectInstance,
} from "../../axios/axiosConfig";
import { useNavigate } from "react-router-dom";

import { Col, Row } from "react-bootstrap";
import SideBar from "../../components/sidebar";
import Follow from "../../components/follow";

import Report from "../../components/report-popup/Report";
import Notification, { notifySuccess, notifyError } from "../../components/notification";

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

function Post({ value }) {
  const sessionData = JSON.parse(sessionStorage.getItem("userSession")) || {};
  const navigate = useNavigate();
  const { role, currentUserId } = sessionData;
  const [project, setProject] = useState();
  const [blogPopups, setBlogPopups] = useState({});
  const [postList, setPostList] = useState([]);
  const [postListTrend, setPostListTrend] = useState([]);
  const [search, setSearch] = useState("");
  const [filterPost, setFilterPost] = useState([]);
  const [resetPage, setResetPage] = useState(false);
  const [showTrendList, setShowTrendList] = useState(false);
  //______________________________//
  const createData = (
    id,
    createdDate,
    avatar,
    title,
    content,
    view,
    like,
    viewPostImages,
    fullName,
    isLike,
    isVerified
  ) => {
    return {
      id,
      createdDate,
      avatar,
      title,
      content,
      view,
      like,
      viewPostImages,
      fullName,
      isLike,
      isVerified
    };
  };
  const handleLikeOrUnlikeBlog = (idBlog) => {
    // Find the index of the blog item to update
    const index = postList.findIndex((item) => item.id === idBlog);
    if (index !== -1) {
      // Toggle the like state and update the like count for the specific blog item
      const newData = [...postList]; // Copy the current state
      const isLiked = !newData[index].isLike; // Toggle the current like state
      newData[index].isLike = isLiked; // Update the like state
      // Update the like count based on the new like state
      newData[index].like = isLiked
        ? newData[index].like + 1
        : newData[index].like - 1;

      setPostList(newData); // Update the state with the new array

      // Make the API call to update the like state in the backend
      postInstance
        .post(`LikeOrUnlikePost/${currentUserId}/${idBlog}`)
        .then(() => {
          setResetPage(!resetPage);
          // If the API call is successful, you can optionally refresh the data from the server
          // to ensure the UI is in sync with the backend state
        })
        .catch((error) => {
          console.error(error);
          // Revert the like state and count in case of an error
          const revertData = [...postList];
          revertData[index].isLike = !isLiked; // Revert the like state
          revertData[index].like = revertData[index].isLike
            ? revertData[index].like + 1
            : revertData[index].like - 1;
          setPostList(revertData);
        });
    }
  };
  useEffect(() => {
    postInstance
      .get(`GetAllPublicPosts/${currentUserId}`)
      .then((res) => {
        const postList = res?.data?.result;
        setPostList([]);
        postList.map((element) => {
          const time = calculateTimeDifference(element.createdDate);
          setPostList((prevData) => [
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
              element.fullName,
              element.isLike,
              element.isVerified
            ),
          ]);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [resetPage, currentUserId]);
  useEffect(() => {
    postInstance.get(`GetAllPostsTrend/${currentUserId}`)
      .then((res) => {
        const postList = res?.data?.result;
        setPostListTrend([]);
        postList.map((element) => {
          const time = calculateTimeDifference(element.createdDate);
          setPostListTrend((prevData) => [
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
              element.fullName,
              element.isLike,
              element.isVerified
            ),
          ]);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [resetPage, , currentUserId])

  useEffect(() => {
    projectInstance
      .get("GetAllProjects")
      .then((res) => {
        setProject(res?.data?.result);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const hanldeViewDetail = (postId) => {
    console.log(postId);
    navigate("/postdetail", { state: { idPost: postId } });
  };
  const handleSearchPost = (event) => {
    setSearch(event.target.value);
    const searchLower = event.target.value.toLowerCase();
    const filtered = postList.filter(
      (post) =>
        post.fullName.toLowerCase().includes(searchLower) ||
        post.title.toLowerCase().includes(searchLower)
    );
    setFilterPost(filtered);
  };
  const carouselRef = useRef(null);
  useEffect(() => {
    if (carouselRef.current) {
      var carouselInstance = new bootstrap.Carousel(carouselRef.current, {
        interval: 99999999,
        wrap: true,
      });
    }

    return () => {
      if (carouselInstance) {
        carouselInstance.dispose();
      }
    };
  }, []);
  const toggleTrendList = () => {
    setShowTrendList(!showTrendList);
  };
  return (
    <Row className="pt-3 ms-0 me-0">
      <Col md={3}>
        <SideBar />
      </Col>
      <Col md={6}>
        <div id="post">
          <div className="post-form p-2 d-flex flex-grid align-items-center justify-content-between row m-0">
            <div className="d-flex post-search align-items-center position-relative col me-2">
              <CiSearch className="search_icon" />
              <input
                type="text"
                onChange={handleSearchPost}
                value={search}
                placeholder={"Search"}
                className="search-box size-20 w-100"
              />
            </div>
            <div className="d-flex flex-row align-items-center col-auto m-md-0-cus mt-2 p-0">
              <button type="button" className="btn btn-info text-white" onClick={toggleTrendList}>
                {showTrendList ? 'ViewAll' : "Trend"}
              </button>
            </div>
          </div>

          {(showTrendList ? postListTrend : (search ? filterPost : postList))?.map((item) => (
            <div
              key={item.id}
              className={`pos-rel post-item mt-2 p-2 ${blogPopups[item.id] ? "position-relative" : ""
                }`}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <div className="position-relative">
                    <div className="profile">
                      <img src={item.avatar} alt="profile" />
                    </div>
                    {item.isVerified && <img src={tick} alt="tick" className="position-absolute bottom-0 end-0" style={{ width: '18px' }} />}
                  </div>

                  <div className=" ms-2 left-30 d-flex flex-column justify-content-center">
                    <div className="size-20 SFU-heavy d-flex">
                      {item.fullName}
                    </div>
                    <div className="size-14 SFU-reg text-gray-600 d-flex">
                      {item.createdDate}
                    </div>
                  </div>
                </div>
                {role !== 'Admin' &&
                  <Report id={currentUserId} idItem={item.id} type="post" />
                }
              </div>
              <h4 className="mt-2">{item.title}</h4>
              <div style={{ maxHeight: '200px', overflow: 'hidden' }} className="mb-3">
                <div dangerouslySetInnerHTML={{ __html: item.content }} />
              </div>
              <div
                id={`carouselExampleControls-${item.id}`}
                className="carousel slide"
                data-bs-ride="carousel"
                ref={carouselRef} // Thêm tham chiếu này
              >
                <div className="carousel-inner">
                  {item.viewPostImages?.map((items, index) => (
                    <div
                      className={`carousel-item ${index === 0 ? "active" : ""}`}
                    >
                      <div className="image-container d-flex justify-content-center">
                        <img
                          src={items.imageSrc}
                          className="d-block w-100"
                          alt=""
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {item.viewPostImages?.length > 1 && (
                  <>
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target={`#carouselExampleControls-${item.id}`}
                      data-bs-slide="prev"
                    >
                      <span
                        className="carousel-control-prev-icon"
                        style={{
                          backgroundColor: "rgba(128, 128, 128, 0.6)",
                          padding: "15px",
                        }}
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                      className="carousel-control-next"
                      type="button"
                      data-bs-target={`#carouselExampleControls-${item.id}`}
                      data-bs-slide="next"
                    >
                      <span
                        className="carousel-control-next-icon"
                        style={{
                          backgroundColor: "rgba(128, 128, 128, 0.6)",
                          padding: "15px",
                        }}
                        aria-hidden="true"
                      ></span>
                      <span className="visually-hidden">Next</span>
                    </button>
                  </>
                )}
              </div>

              <div className="d-flex justify-content-between mt-2">
                <div className="d-flex align-items-center">
                  <div className="d-flex align-items-center me-3">
                    <FiEye className="me-2" /> {item.view}
                  </div>
                  <div
                    className="d-flex align-items-center me-3"
                    onClick={() => handleLikeOrUnlikeBlog(item.id)}
                  >
                    <FaHeart
                      className={`me-2 ${item.isLike === true ? "red" : ""}`}
                    />{" "}
                    {item.like}
                  </div>
                </div>
                <button
                  className="view-btn btn"
                  onClick={() => hanldeViewDetail(item.id)}
                >
                  View Detail
                </button>
              </div>
            </div>
          ))}
        </div>
      </Col>
      <Col md={3}>
        <Follow followValue={value} />
      </Col>
    </Row>
  );
}

export default Post;
