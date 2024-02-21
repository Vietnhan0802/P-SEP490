import React, { useEffect, useState, useMemo } from "react";
import "./detail.scss";
import avatarDefault from "../../images/common/default.png";
import { IoFlagOutline } from "react-icons/io5";
import { FiEye } from "react-icons/fi";
import { VscSend } from "react-icons/vsc";
import { blogInstance } from "../../axios/axiosConfig";
import { FaHeart } from "react-icons/fa";
import Cookies from "js-cookie";
import Dropdown from 'react-bootstrap/Dropdown';
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
function BlogDetail(id) {

  //__________________________________________________________________//

  const userId = JSON.parse(Cookies.get("userId"));
  const idBlog = id.id;

  const [data, setData] = useState({});
  const [content, setContent] = useState('');
  const [commentList, setCommentList] = useState([]);
  const [viewReply, setViewReply] = useState(null);
  const [state, setState] = useState(true)
  const [updateCommentShow, setUpdateCommentShow] = useState(null);
  const [originalContent, setOriginalContent] = useState('');
  //__________________________________________________________________//

  const handleLikeOrUnlikeBlog = () => {
    blogInstance.post(`LikeOrUnlikeBlog/${userId}/${idBlog}`)
      .then((res) => {
        
      })
      .catch((error) => {
        console.error(error)
      })
  }
  const handleUpdateCommentAppear = (blogId, originalContent) => {
    setUpdateCommentShow((prev) => (prev === blogId ? null : blogId));
    // If the original content is not set (i.e., it's an empty string), set it with the current content
    setOriginalContent(originalContent || '');
  };
  const handleUpdateCommentCancel = () => {
    setUpdateCommentShow(null);
    setState(!state);
  };
  const handleUpdateComment = (idBlogComment, content) => {
    blogInstance.put(`UpdateBlogComment/${idBlogComment}/${content}`)
      .then(() => {
        setUpdateCommentShow(null);
        setState(!state);
      }
      )
      .catch((error) => {
        console.error(error);
      })
  };
  const handleViewReply = (blogId) => {
    setViewReply((prev) => (prev === blogId ? null : blogId));
  };
  const handleInputComment = (event) => {
    setContent(event.target.value);
  }
  const handleUpdateInputComment = (commentId, newContent) => {
    setCommentList((prevComments) =>
      prevComments.map((comment) =>
        comment.idBlogComment === commentId
          ? { ...comment, content: newContent }
          : comment
      )
    );
  };
  const handleCreateComment = () => {
    blogInstance.post(`CreateBlogComment/${userId}/${idBlog}/${content}`, {
      headers: {
        accept: 'application/json'
      }
    })
      .then((res) => {
        setState(!state);
        console.log(res)
      })
      .catch((error) => { console.error(error) });
  }
  const memoizedBlogInstance = useMemo(() => {
    return blogInstance; // hoặc tạo một instance mới nếu cần
  }, []);
  useEffect(() => {
    blogInstance.get(`GetAllCommentByBlog/${idBlog}`)
      .then(
        (res) => {
          setCommentList(res?.data?.result);
        }
      )
      .catch((error) => {
        console.error(error);
      })
  }, [state]);

  useEffect(() => {
    memoizedBlogInstance.get(`GetBlogById/${idBlog}/${userId}`)
      .then((res) => {
        setData(res?.data?.result);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [memoizedBlogInstance, idBlog]);
  const handleDeleteComment = (id) => {
    console.log(id);
    blogInstance.delete(`RemoveBlogComment/${id}`)
      .then(
        (res) => {
          console.log(res.data.result);
          setState(!state);
        }
      ).catch((error) => {
        console.error(error);
      })
  }
  const dateTime = calculateTimeDifference(data.createdDate);
  const [like, setLike] = useState(data.isLike);

  return (
    <div id="BlogDetail" className="p-3">
      <div className="d-flex align-items-center mb-2">
        <img src={data.avatar} alt="profile" className="profile" />
        <div className="ms-2">
          <h6 className="mb-0">{data.fullName}</h6>
          <p className="mb-0">{dateTime}</p>
        </div>
      </div>
      <h3 className="fw-bold">{data.title}</h3>
      <p>
        {data.content}
      </p>
      <div>
        {data.viewBlogImages && (
          data.viewBlogImages.length === 1 ? (
            <img src={data.viewBlogImages[0].imageSrc} alt="" className="w-100" />
          ) : (
            data.viewBlogImages.map((item, index) => (
              <img key={index} src={item.imageSrc} alt="" className="w-100" />
            ))
          )
        )}

      </div>
      <div className="d-flex align-items-center border-bottom pb-3 mt-2 border-dark">
        <div className="d-flex align-items-center me-3">
          <FiEye className="me-2" /> {data.view + 1}
        </div>
        <div className="d-flex align-items-center me-3"
          onClick={() => handleLikeOrUnlikeBlog()}
        >
          <FaHeart className={`me-2 ${like === true ? 'red' : ''}`} /> {data.like}
        </div>
        <div
          className="d-flex align-items-center me-3"
        // onClick={() => handleReportClick(item.id)}
        >
          <IoFlagOutline />{" "}
        </div>
      </div>
      <p className="cmt fw-bold my-3">COMMENT</p>
      <div className="cmt-input d-flex align-items-center">
        <img src={data.avatar} alt="" className="profile" />
        <input
          type="text"
          className="w-100 ps-3"
          placeholder="Type your comment"
          value={content}
          onChange={handleInputComment}
        />
        <VscSend style={{ fontSize: "30px" }} onClick={handleCreateComment} />
      </div>
      <div className="cmt-block">
        {commentList.map((item) => (
          <div
            key={item.id}
            className={`d-flex pb-3 mt-2 cmt-item ${item.type === "reply-comment" ? "ms-5" : ""
              }`}
          >
            <img src={item.avatar === 'https://localhost:7006/Images/' ? avatarDefault : item.avatar} alt="" className="profile" />
            <div className="ms-3  w-100 ">
              <div className="d-flex  justify-content-between">
                <h6 className="mb-2 d-flex align-items-center h-40">
                  {item.fullName}
                </h6>
                {item.idAccount === userId ?
                  <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic" className="bg-white border-none text-body">
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item onClick={() => handleUpdateCommentAppear(item.idBlogComment)}>Update</Dropdown.Item>
                      <Dropdown.Item onClick={() => handleDeleteComment(item.idBlogComment)}>Delete</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown> : ""
                }
              </div>
              {updateCommentShow !== item.idBlogComment ? (
                <p className="mb-0">{item.content}</p>
              ) : (
                <>
                  <input
                    type="text"
                    className="form-control"
                    value={originalContent || item.content}
                    onChange={(e) => handleUpdateInputComment(item.idBlogComment, e.target.value)}
                  />
                  <button onClick={() => handleUpdateCommentCancel(item.idBlogComment)}>Cancel</button>
                  <button onClick={() => handleUpdateComment(item.idBlogComment, item.content)}>Save</button>
                </>
              )}
              <div className="rep d-flex w-100" >
                <div className={`d-flex justify-content-between w-100 align-items-center ${viewReply !== item.idBlogComment ? 'justify-content-end' : "justify-content-between"}`}>
                  {viewReply !== item.idBlogComment ?
                    <div className="d-flex justify-content-between align-items-center w-100 py-2">
                      <p onClick={() => handleViewReply(item.idBlogComment)}>View Reply</p>
                      <p onClick={() => handleViewReply(item.idBlogComment)}>Reply</p>
                    </div> :
                    <div className="d-flex justify-content-end align-items-center w-100">
                      <p onClick={() => handleViewReply(item.idBlogComment)}>Close</p>
                    </div>
                  }
                </div>
              </div>
              <div>
                {viewReply === item.id ? (
                  item.viewBlogReplies.map((reply) => (
                    <>
                      <div className="d-flex">
                        <img src={reply.avatar === 'https://localhost:7006/Images/' ? avatarDefault : item.avatar} alt="" className="profile" />
                        <div className="ms-3">
                          <h6 className="mb-2 d-flex align-items-center h-40">
                            {reply.fullName}
                          </h6>
                          <p className="mb-0">{reply.content}</p>
                        </div>
                      </div>
                      <div className="d-flex justify-content-end w-100 align-items-center" >
                        <p>Reply</p>
                      </div>
                    </>
                  ))
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BlogDetail;
