import React from "react";
import { FaHeart } from "react-icons/fa";
import { IoFlagOutline } from "react-icons/io5";
import { FiEye } from "react-icons/fi";
import { calculateTimeDifference } from '../Detail/helpers'
import defaultAvatar from "../../images/common/default.png"
function PostContent({ data, handleLikeOrUnlikePost, viewProject }) {
  const handleViewproject = () => {
    viewProject(data?.idProject)
  }
  return (
    <>
      <div className="d-flex align-items-center mb-2">
        <img src={data?.avatar === "https://localhost:7006/Images/" ? defaultAvatar : data?.avatar} alt="profile" className="profile" />
        <div className="ms-2">
          <h6 className="mb-0">{data?.fullName}</h6>
          <p className="mb-0">{calculateTimeDifference(data?.createdDate)}</p>
        </div>
      </div>
      <p className="fs-4 fw-bold">{data?.title}</p>
      <p style={{ whiteSpace: 'pre-wrap' }}>
        {data?.content}
      </p>
      <div>
        {data?.viewPostImages?.map((image) => (
          <img src={image.imageSrc} alt="" className="w-100" />
        ))}
      </div>
      <button className="btn btn-outline-info mt-3" onClick={handleViewproject}>View Project</button>

      <div className="d-flex align-items-center border-bottom pb-3 mt-2 border-dark">
        <div className="d-flex align-items-center me-3">
          <FiEye className="me-2" /> {data?.view + 1}
        </div>
        <div className="d-flex align-items-center me-3"
          onClick={() => handleLikeOrUnlikePost()}
        >
          <FaHeart className={`me-2 ${data?.isLike === true ? 'red' : ''}`} /> {data?.like}
        </div>
        <div
          className="d-flex align-items-center me-3"
        // onClick={() => handleReportClick(item.id)}
        >
          <IoFlagOutline />{" "}
        </div>
      </div>
    </>
  )
}

export default PostContent
