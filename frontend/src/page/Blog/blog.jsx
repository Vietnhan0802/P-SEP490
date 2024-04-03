import React, { useEffect, useRef } from "react";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min";
import { useState } from "react";
import "../Blog/blog.scss";
import { FaHeart } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { FiEye } from "react-icons/fi";
import { RiAdminLine } from "react-icons/ri";
import { blogInstance } from "../../axios/axiosConfig";
import BlogPu from "./blogPu";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import Follow from "../../components/follow";
import SideBar from "../../components/sidebar";
import Report from "../../components/report-popup/Report";
import tick from "../../images/common/verifiedTick.png";
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
function Blog({ value }) {
  const createData = (
    id,
    avatar,
    createdDate,
    title,
    content,
    view,
    like,
    viewBlogImages,
    fullName,
    isLike
  ) => {
    return {
      id,
      avatar,
      createdDate,
      title,
      content,
      view,
      like,
      viewBlogImages,
      fullName,
      isLike,
    };
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
  //_________________________________________________________//
  const [blogPopups, setBlogPopups] = useState({});
  const [data, setData] = useState([]);
  const sessionData = JSON.parse(sessionStorage.getItem("userSession")) || {};
  const { role, currentUserId } = sessionData;
  const [reset, setReset] = useState(true);
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterBlog, setFilterBlog] = useState([]);
  const [blogListTrend, setBlogListTrend] = useState([]);
  const [showTrendList, setShowTrendList] = useState(false);
  //_________________________________________________________//

  const hanldeViewDetail = (blogId) => {
    navigate("/blogdetail", { state: { idBlog: blogId } });
  };
  //Hanlde like or unlike the the blog
  const handleLikeOrUnlikeBlog = (idBlog) => {
    // Find the index of the blog item to update
    const index = data.findIndex((item) => item.id === idBlog);
    if (index !== -1) {
      // Toggle the like state and update the like count for the specific blog item
      const newData = [...data]; // Copy the current state
      const isLiked = !newData[index].isLike; // Toggle the current like state
      newData[index].isLike = isLiked; // Update the like state
      // Update the like count based on the new like state
      newData[index].like = isLiked
        ? newData[index].like + 1
        : newData[index].like - 1;

      setData(newData); // Update the state with the new array

      // Make the API call to update the like state in the backend
      blogInstance
        .post(`LikeOrUnlikeBlog/${currentUserId}/${idBlog}`)
        .then(() => {
          // If the API call is successful, you can optionally refresh the data from the server
          // to ensure the UI is in sync with the backend state
        })
        .catch((error) => {
          console.error(error);
          // Revert the like state and count in case of an error
          const revertData = [...data];
          revertData[index].isLike = !isLiked; // Revert the like state
          revertData[index].like = revertData[index].isLike
            ? revertData[index].like + 1
            : revertData[index].like - 1;
          setData(revertData);
        });
    }
  };
  // Handler function to update the state when the input changes
  useEffect(() => {
    blogInstance
      .get(`GetAllPublicBlogs/${currentUserId}`)
      .then((res) => {
        const blogList = res?.data?.result;
        setData([]);
        blogList.map((element) => {
          const time = calculateTimeDifference(element.createdDate);
          setData((prevData) => [
            ...prevData,
            createData(
              element.idBlog,
              element.avatar,
              time,
              element.title,
              element.content,
              element.view,
              element.like,
              element.viewBlogImages,
              element.fullName,
              element.isLike
            ),
          ]);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [reset, currentUserId]);
  useEffect(() => {
    blogInstance
      .get(`GetAllBlogsTrend/${currentUserId}`)
      .then((res) => {
        const blogList = res?.data?.result;
        setBlogListTrend([]);
        blogList.map((element) => {
          const time = calculateTimeDifference(element.createdDate);
          setBlogListTrend((prevData) => [
            ...prevData,
            createData(
              element.idBlog,
              element.avatar,
              time,
              element.title,
              element.content,
              element.view,
              element.like,
              element.viewBlogImages,
              element.fullName,
              element.isLike
            ),
          ]);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [])
  const resetBlog = () => {
    setReset((prevReset) => !prevReset);
  };
  const handleSearchPost = (event) => {
    setSearch(event.target.value);
    const searchLower = event.target.value.toLowerCase();
    const filtered = data.filter(blog =>
      blog.fullName.toLowerCase().includes(searchLower) || blog.title.toLowerCase().includes(searchLower)
    );
    setFilterBlog(filtered);
  }
  const toggleTrendList = () => {
    setShowTrendList(!showTrendList);
  };

  return (
    <Row className="pt-3 ms-0 me-0">
      <Col md={3}>
        <SideBar />
      </Col>
      <Col md={6}>
        <div id="blog">
          <div className="blog-form p-2 d-flex flex-grid align-items-center justify-content-between row m-0">
            <div className="d-flex blog-search align-items-center position-relative col me-2">
              <CiSearch className="" />
              <input
                type="text"
                onChange={handleSearchPost}
                value={search}
                placeholder={"Search"}
                className="search-box size-20 w-100"
              />
            </div>
            <div className="d-flex flex-row align-items-center col-auto m-md-0-cus mt-2 p-0">
              {role === "Admin" ? <BlogPu resetBlog={resetBlog} /> : ""}

              <button type="button" className="btn btn-info text-white" onClick={toggleTrendList}>
                {showTrendList ? 'ViewAll' : "Trend"}
              </button>
            </div>
          </div>

          {(showTrendList ? blogListTrend : (search ? filterBlog : data))?.map((item) => (
            <div
              key={item.idBlog}
              className={`blog-item p-2 ${blogPopups[item.id] ? "position-relative" : ""
                }`}
            >
              <div className="d-flex justify-content-between align-items-center">
                {" "}
                <div className="d-flex align-items-center">
                  <div className="position-relative">
                    <img src={item.avatar} alt="user" className="avatar-contain"  style={{borderRadius:'50%'}}/>
                    <img src={tick} alt="tick" className="position-absolute bottom-0 end-0" style={{ width: '18px' }} />
                  </div>
                  <div className="ms-2">
                  <h6 className="size-20 SFU-heavy d-flex">{item.fullName}</h6>
                  <p className="size-14 SFU-reg text-gray-600 d-flex">{item.createdDate}</p>
                  </div>
                </div>
                <Report id={currentUserId} idItem={item.id} type="blog" />
              </div>

              <h3 className="mt-2">{item.title}</h3>
              <div dangerouslySetInnerHTML={{ __html: item.content }} />
              <div
                id={`carouselExampleControls-${item.id}`}
                className="carousel slide"
                data-bs-ride="carousel"
                ref={carouselRef} // Thêm tham chiếu này
              >
                <div className="carousel-inner">
                  {item.viewBlogImages?.map((items, index) => (
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

                {item.viewBlogImages?.length > 1 && (
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
                    <FiEye className="me-2" />
                    {item.view}
                  </div>
                  <div
                    className="d-flex align-items-center me-3"
                    onClick={() => handleLikeOrUnlikeBlog(item.id)}
                  >
                    <FaHeart className={`me-2 ${item.isLike ? "red" : ""}`} />{" "}
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

export default Blog;
