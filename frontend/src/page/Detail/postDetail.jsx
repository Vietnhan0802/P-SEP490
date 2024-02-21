import React, { useEffect, useMemo, useState } from "react";
import "./detail.scss";
import defaultAvatar from "../../images/common/default.png"
import { CiHeart } from "react-icons/ci";
import { IoFlagOutline } from "react-icons/io5";
import { BsChat } from "react-icons/bs";
import { FiEye } from "react-icons/fi";
import Corey from "../../images/cmt/Corey.png";
import Emerson from "../../images/cmt/Emerson.png";
import Jordyn from "../../images/cmt/Jordyn.png";
import Terry from "../../images/cmt/Terry.png";
import Zaire from "../../images/cmt/Zaire.png";
import Cookies from "js-cookie";
import { postInstance } from "../../axios/axiosConfig";
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
function PostDetail(id) {
  const postContent = [
    {
      id: 1,
      type: "comment",
      img: Corey,
      name: "Corey Septimus",
      content:
        "Lorem ipsum dolor sit amet consectetur. Tortor commodo faucibus scelerisque cursus. Mi interdum ultricies lectus amet viverra aliquet mattis gravida adipiscing. Sit proin non blandit quis euismod dignissim vestibulum pellentesque. Porttitor sem lorem maecenas sit.",
    },
    {
      id: 2,
      type: "comment",
      img: Emerson,
      name: "Emerson Dorwart",
      content:
        "Lorem ipsum dolor sit amet consectetur. Augue sit vitae sem nibh turpis. In facilisi eget fringilla euismod lacus vulputate tellus. Eu nisi neque magna id. Ut bibendum ut mi aliquet malesuada mauris purus vulputate nulla. Etiam leo scelerisque quam ultrices purus odio vitae facilisi neque. Habitant non suspendisse lectus fringilla pulvinar et mattis. Vel orci libero eu malesuada nec eget orci orci senectus. Interdum risus arcu ut vitae tincidunt ut mauris sit.",
    },
    {
      id: 3,
      type: "reply-comment",
      img: Jordyn,
      name: "Jordyn Bergson",
      content:
        "Lorem ipsum dolor sit amet consectetur. Augue sit vitae sem nibh turpis. In facilisi eget fringilla euismod lacus vulputate tellus. Eu nisi neque magna id. Ut bibendum ut mi aliquet malesuada mauris purus vulputate nulla. Etiam leo scelerisque quam ultrices purus odio vitae facilisi neque. Habitant non suspendisse lectus fringilla pulvinar et mattis. Vel orci libero eu malesuada nec eget orci orci senectus. Interdum risus arcu ut vitae tincidunt ut mauris sit.",
    },
    {
      id: 4,
      type: "reply-comment",
      img: Terry,
      name: "Terry Schleifer",
      content:
        "Lorem ipsum dolor sit amet consectetur. Aliquet aliquet senectus urna ornare auctor proin amet.",
    },
    {
      id: 5,
      type: "comment",
      img: Zaire,
      name: "Zaire Workman",
      content:
        "Lorem ipsum dolor sit amet consectetur. Ornare dictumst id lorem faucibus sit quam. Tincidunt penatibus neque varius elit natoque ut. Nulla duis odio et sem in tortor ipsum lobortis.",
    },
  ];

  const userId = JSON.parse(Cookies.get("userId"));
  const idPost = id.id;
  const [data, setData] = useState();
  const memoizedPostInstance = useMemo(() => {
    return postInstance; // hoặc tạo một instance mới nếu cần
  }, []);

  useEffect(() => {
    memoizedPostInstance.get(`GetPostById/${idPost}`)
      .then((res) => {
        setData(res?.data?.result);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [memoizedPostInstance, idPost]);

  console.log(data);
  return (
    <div id="postDetail" className="p-3">
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
      <div className="d-flex align-items-center border-bottom pb-3 mt-2 border-dark">
        <div className="d-flex align-items-center me-3">
          <FiEye className="me-2" /> {data?.view + 1}
        </div>
        <div className="d-flex align-items-center me-3">
          <CiHeart className="me-2" /> {data?.like}
        </div>
        <div
          className="d-flex align-items-center me-3"
        // onClick={() => handleReportClick(item.id)}
        >
          <IoFlagOutline />{" "}
        </div>
      </div>
      <p className="cmt fw-bold my-3">COMMENT</p>
      <div className="cmt-input d-flex ">
        <img src={data?.avatar === "https://localhost:7006/Images/" ? defaultAvatar : data?.avatar} alt="" className="profile" />
        <input
          type="text"
          className="w-100 ps-3"
          placeholder="Type your comment"
        />
      </div>
      <div className="cmt-block">
        {postContent.map((item) => (
          <div
            className={`d-flex pb-3 mt-2 cmt-item ${item.type === "reply-comment" ? "ms-5" : ""
              }`}
          >
            <img src={item.img} alt="" className="profile" />
            <div className="ms-3">
              <h6 className="mb-2 d-flex align-items-center h-40">
                {item.name}
              </h6>
              <p className="mb-0">{item.content}</p>
              <div
                className={`rep d-flex mt-3 fs-bold ${item.type === "reply-comment"
                    ? "justify-content-end"
                    : "justify-content-between"
                  }`}
              >
                {item.type !== "reply-comment" ? (
                  <>
                    <div>View comment</div> <div>Reply</div>{" "}
                  </>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostDetail;
