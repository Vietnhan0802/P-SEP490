import React, { useEffect } from "react";
import { useState } from "react";
import "../Blog/blog.scss";
import { IoFlagOutline } from "react-icons/io5";
import { FaHeart } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { FiEye } from "react-icons/fi";
import { RiAdminLine } from "react-icons/ri";
import ReportPopup from "../../components/Popup/reportPopup";
import { blogInstance } from "../../axios/axiosConfig";
import BlogPu from "./blogPu";
import { useNavigate } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import Follow from "../../components/follow";
import SideBar from "../../components/sidebar";

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
function Blog() {
  const createData = (
    id,
    createdDate,
    title,
    content,
    view,
    like,
    viewBlogImages,
    fullName, isLike
  ) => {
    return {
      id,
      createdDate,
      title,
      content,
      view,
      like,
      viewBlogImages,
      fullName,
      isLike
    };
  };

  //_________________________________________________________//
  const [blogPopups, setBlogPopups] = useState({});
  const [data, setData] = useState([]);
  const sessionData = JSON.parse(sessionStorage.getItem("userSession")) || {};
  const { role, currentUserId } = sessionData;
  const [reset, setReset] = useState(true);
  const navigate = useNavigate();
  //_________________________________________________________//

  const hanldeViewDetail = (blogId) => {
    navigate("/blogdetail", { state: { idBlog: blogId } });
  };
  const handleReportClick = (blogId) => {
    setBlogPopups((prev) => ({ ...prev, [blogId]: true }));
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
    blogInstance.get(`GetAllBlogs/${currentUserId}`)
      .then((res) => {
        const blogList = res?.data?.result;
        setData([]);
        blogList.map((element) => {
          const time = calculateTimeDifference(element.createdDate);
          setData((prevData) => [
            ...prevData,
            createData(
              element.idBlog,
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
  }, [reset]);
  const resetBlog = (value) => {
    setReset(!reset);
  }
  return (
    <Row className="pt-3 ms-0 me-0">
      <Col md={3} >
        <SideBar />
      </Col>
      <Col md={6}>
        <div id="blog">

          <div className="blog-form p-2 d-flex flex-grid align-items-center justify-content-between row m-0">
            <div className="d-flex blog-search align-items-center position-relative col me-2">
              <CiSearch className="" />
              <input
                type="text"
                placeholder={"Search"}
                className="search-box size-20"
              />
            </div>
            <div className="d-flex flex-row align-items-center col-auto m-md-0-cus mt-2 p-0">
              {role === "Admin" ? (<BlogPu resetBlog={resetBlog} />) : (
                ""
              )}

              <button type="button" className="btn btn-info text-white">
                Trend
              </button>
            </div>
          </div>

          {data.map((item) => (
            <div
              key={item.idBlog}
              className={`blog-item p-2 ${blogPopups[item.id] ? "position-relative" : ""
                }`}
            >
              <div className="d-flex align-items-center">
                <div alt="profile" className="profile">
                  <RiAdminLine />
                </div>
                <div className="ms-2">
                  <h6 className="mb-0">{item.fullName}</h6>
                  <p className="mb-0">{item.createdDate}</p>
                </div>
              </div>
              <h3 className="mt-2">{item.title}</h3>

              <p className="mt-2" style={{ whiteSpace: "pre-wrap" }}>
                {item.content}
              </p>
              <div className="d-flex">
                {item.viewBlogImages.map((items) => (
                  <img src={items.imageSrc} alt="" className="w-50 p-2" />
                ))}
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
                  <div
                    className="d-flex align-items-center me-3"
                    onClick={() => handleReportClick(item.id)}
                  >
                    <IoFlagOutline />{" "}
                  </div>
                </div>
                <button
                  className="view-btn btn"
                  onClick={() => hanldeViewDetail(item.id)}
                >
                  View Detail
                </button>
              </div>
              {blogPopups[item.id] && (
                <ReportPopup
                  trigger={blogPopups[item.id]}
                  setTrigger={(value) =>
                    setBlogPopups((prev) => ({ ...prev, [item.id]: value }))
                  }
                >
                  <div className="bg-white h-100 blog-report">
                    <h3 className="text-center border-bottom pb-2">Report</h3>
                    <p>
                      <b>Please fill in your feedback</b>
                    </p>
                    <textarea
                      type="text"
                      placeholder="What's wrong with this blog"
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
      </Col>
      <Col md={3}>
        <Follow />
      </Col>
    </Row>
  );
}

export default Blog;
