import React, { useEffect, useRef, useState } from "react";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min";
import { FaHeart } from "react-icons/fa";
import Dropdown from "react-bootstrap/Dropdown";
import { FiEye } from "react-icons/fi";
import { calculateTimeDifference } from "../Detail/helpers";
import defaultAvatar from "../../images/common/default.png";
import Report from "../../components/report-popup/Report";
import { GrUpdate } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import UpdateItem from "./Popup/UpdateItem";
import DeleteItem from "./Popup/DeleteItem";
import { useNavigate } from "react-router-dom";
import { projectInstance } from "../../axios/axiosConfig";
import AlertProject from "./Popup/Alert";
import { Button } from "react-bootstrap";
import { BsThreeDots } from "react-icons/bs";

function PostContent({ data, handleLikeOrUnlikePost, viewProject, userId }) {
  const navigate = useNavigate();

  const [display, setDisplay] = useState(false);
  const [displayDelete, setDisplayDelete] = useState(false);
  const [displayAlert, setDisplayAlert] = useState(false);
  const [message, setMessage] = useState('');
  const sessionData = JSON.parse(sessionStorage.getItem("userSession")) || {};
  const { currentUserId } = sessionData;
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
  const handleUpdatePost = () => {
    setDisplay(true);
  }
  const handleDeletePost = () => {
    setDisplayDelete(true);
  }
  const handleViewProject = () => {
    // First, check if the project with the given ID exists.
    projectInstance.get(`GetProjectById/${data.idProject}`)
      .then((res) => {
        if (res?.data?.result !== null && res?.data?.result?.visibility !== 2) {
          navigate('/projectdetail', { state: { idProject: data.idProject } });
        } else {
          setDisplayAlert(true);
          setMessage('This Project is no longer exist.')
        }
      })
      .catch((error) => {
        console.error("Error fetching project:", error);
      });
  };
  return (
    <>
      <div className="d-flex  justify-content-between">
        <div className="d-flex align-items-center mb-2">
          <img
            src={
              data?.avatar === "https://localhost:7006/Images/"
                ? defaultAvatar
                : data?.avatar
            }
            alt="profile"
            className="profile"
          />
          <div className="ms-2">
            <h6 className="mb-0">{data?.fullName}</h6>
            <p className="mb-0">{calculateTimeDifference(data?.createdDate)}</p>
          </div>
        </div>
        {data?.idAccount === userId ? (
          <Dropdown>
            <Dropdown.Toggle
              as={Button}
              variant="white"
              className="border-none text-body"
              style={{
                "&::after": {
                  content: "",
                  border: "none",
                },
              }}
            >
              <BsThreeDots size={28} /></Dropdown.Toggle>

            <Dropdown.Menu style={{ minWidth: "auto" }}>
              <Dropdown.Item
                className="d-flex justify-content-center"
                onClick={() =>
                  handleUpdatePost()
                }
              >
                <GrUpdate size={28} />

              </Dropdown.Item>
              <Dropdown.Item
                className="d-flex justify-content-center"
                onClick={() =>
                  handleDeletePost()
                }
              >
                <MdDelete size={28} />
              </Dropdown.Item>
              <Dropdown.Item
              >
                <Report />

              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <Report />
        )}
      </div>
      <UpdateItem
        show={display}
        onClose={() => setDisplay(false)}
        value={data}
        type={'post'}
      />
      <DeleteItem
        show={displayDelete}
        onClose={() => setDisplayDelete(false)}
        value={data?.idPost}
        type={'post'}
      />

      <p className="fs-4 fw-bold">{data?.title}</p>
      <p style={{ whiteSpace: "pre-wrap" }}>{data?.content}</p>
      <div></div>
      <div
        id={`carouselExampleControls-PostUnique`}
        className="carousel slide"
        data-bs-ride="carousel"
        ref={carouselRef} // Thêm tham chiếu này
      >
        <div className="carousel-inner">
          {data?.viewPostImages?.map((datas, index) => (
            <div
              key={datas.id}
              className={`carousel-item ${index === 0 ? "active" : ""}`}
            >
              <div className="image-container d-flex justify-content-center post-content">
                <img src={datas.imageSrc} className="d-block w-100" alt="" />
              </div>
            </div>
          ))}
        </div>
        <AlertProject
          show={displayAlert}
          onClose={() => setDisplayAlert(false)}
          message={message} />
        {data?.viewPostImages?.length > 1 && (
          <>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target={`#carouselExampleControls-PostUnique`}
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
              data-bs-target={`#carouselExampleControls-PostUnique`}
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
      {data?.idProject === '00000000-0000-0000-0000-000000000000' ? "" :
        <button className="btn btn-outline-info mt-3" onClick={handleViewProject}>
          View Project
        </button>
      }
      <div className="d-flex align-items-center border-bottom pb-3 mt-2 border-dark">
        <div className="d-flex align-items-center me-3">
          <FiEye className="me-2" /> {data?.view + 1}
        </div>
        <div
          className="d-flex align-items-center me-3"
          onClick={() => handleLikeOrUnlikePost()}
        >
          <FaHeart className={`me-2 ${data?.isLike === true ? "red" : ""}`} />{" "}
          {data?.like}
        </div>
      </div>
    </>
  );
}

export default PostContent;
