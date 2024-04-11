import React, { useEffect, useRef, useState } from "react";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min";
import { FaHeart } from "react-icons/fa";
import Dropdown from "react-bootstrap/Dropdown";
import { FiEye } from "react-icons/fi";
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
import tick from "../../images/common/verifiedTick.png";
import { formatDistanceToNow, parseISO } from 'date-fns';

function formatTimeAgo(dateString) {
  const result = formatDistanceToNow(parseISO(dateString), { addSuffix: true });
  // Loại bỏ từ "about" khỏi chuỗi
  return result.replace("about ", "");
}
function PostContent({ data, handleLikeOrUnlikePost, viewProject, userId, resetPage, role }) {
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
    projectInstance.get(`GetProjectById/${currentUserId}/${data.idProject}`)
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
  let dateTime;
  if (data?.createdDate && typeof data.createdDate === 'string') {
    dateTime = formatTimeAgo(data.createdDate);
  } else {
    // Handle the case when createdDate is undefined or not a string
    dateTime = 'Unknown date';
  }
  return (
    <>
      <div className="d-flex  justify-content-between">
        <div className="d-flex align-items-center mb-2">
          <div className="position-relative">
            <div className="profile" style={{ width: '50px' }}>
              <img src={data?.avatar} alt="profile" />
            </div>
            {data?.isVerified && <img src={tick} alt="tick" className="position-absolute bottom-0 end-0" style={{ width: '18px' }} />}
          </div>
          <div className="ms-2">
            <h6 className="mb-0">{data?.fullName}</h6>
            <p className="mb-0">{dateTime}</p>
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
              {role !== 'Admin' && data?.idAccount !== userId  &&
                <Dropdown.Item
                >
                  <Report />

                </Dropdown.Item>}

            </Dropdown.Menu>
          </Dropdown>
        ) : (
          <div>
            {role !== 'Admin' &&
              <Report />            }
          </div>

        )}
      </div>
      <UpdateItem
        show={display}
        onClose={() => setDisplay(false)}
        value={data}
        type={'post'}
        resetPage={resetPage}
      />
      <DeleteItem
        show={displayDelete}
        onClose={() => setDisplayDelete(false)}
        value={data?.idPost}
        type={'post'}
      />

      <p className="fs-4 fw-bold ">{data?.title}</p>
      <div dangerouslySetInnerHTML={{ __html: data?.content }} />
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
      {data?.idProject === null ? "" :
        <button className="btn btn-outline-info mt-3" onClick={handleViewProject}>
          View Project
        </button>
      }
      <div className="d-flex align-items-center border-custom pb-3 mt-2">
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
