import React, { useEffect, useState, useMemo } from "react";
import "./detail.scss";
import avatarDefault from "../../images/common/default.png";
import { IoFlagOutline } from "react-icons/io5";
import { FiEye } from "react-icons/fi";
import { VscSend } from "react-icons/vsc";
import { blogInstance, userInstance } from "../../axios/axiosConfig";
import { FaHeart } from "react-icons/fa";
import { GrUpdate } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
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

  const sessionData = JSON.parse(sessionStorage.getItem('userSession')) || {};
  const { role, currentUserId } = sessionData;
  const idBlog = id.id;

  const [user, setUser] = useState({});
  const [data, setData] = useState({});
  const [content, setContent] = useState('');
  const [commentList, setCommentList] = useState([]);
  const [viewReply, setViewReply] = useState(null);
  const [state, setState] = useState(true)
  const [updateShow, setUpdateShow] = useState(null);
  const [originalContent, setOriginalContent] = useState('');
  const [updateReplyShow, setUpdateReplyShow] = useState(null);
  const [replyComment, setReplyComment] = useState(false);
  const [inputReply, setInputReply] = useState({});
  //__________________________________________________________________//

  const handleUpdateCommentAppear = (updateId, originalContent) => {
    setUpdateShow((prev) => (prev === updateId ? null : updateId));
    // If the original content is not set (i.e., it's an empty string), set it with the current content
    setOriginalContent(originalContent || '');
  };
  const handleUpdateReplyCommentAppear = (replyId) => {
    setUpdateReplyShow((prev) => (prev === replyId ? null : replyId));
    // If the original content is not set (i.e., it's an empty string), set it with the current content
    // setOriginalContent(originalContent || '');
  };

  const handleViewReply = (blogId) => {
    setViewReply((prev) => (prev === blogId ? null : blogId));
  };
  const handleShowReplyComment = (blogId) => {
    setViewReply((prev) => (prev === blogId ? null : blogId));
    setReplyComment(!replyComment);
  }
  //Hanlde comment for the blog
  const handleUpdateCommentCancel = () => {
    setUpdateShow(null);
    setState(!state);
  };
  const handleUpdateReplyCancel = () => {
    setUpdateReplyShow(null);
    setState(!state);
  };
  const handleUpdateComment = (idBlogComment, content) => {
    blogInstance.put(`UpdateBlogComment/${idBlogComment}/${content}`)
      .then(() => {
        setUpdateShow(null);
        setState(!state);
      }
      )
      .catch((error) => {
        console.error(error);
      })
  };
  const handleDeleteComment = (id) => {
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
  const handleDeleteReplyComment = (id) => {
    blogInstance.delete(`RemoveBlogReply/${id}`)
      .then(
        (res) => {
          console.log(res.data.result);
          setState(!state);
        }
      ).catch((error) => {
        console.error(error);
      })
  }
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
    blogInstance.post(`CreateBlogComment/${currentUserId}/${idBlog}/${content}`, {
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
  const handleCreateReplyComment = (commentId) => {
    const replyContent = inputReply[commentId];

    // Perform the reply submission logic with replyContent
    // ...
    blogInstance.post(`CreateBlogReply/${currentUserId}/${commentId}/${replyContent}`)
      .then((res) => {
        setState(!state)
        console.log(res?.data?.result)
      })
      .catch((error) => { console.error(error) });
    // After successful submission, clear the input field for that commentId
    setInputReply(prevReplyInputs => ({
      ...prevReplyInputs,
      [commentId]: '' // This will clear the input field after submitting
    }));
  }

  const handleInputReplyComment = (commentId, content) => {
    setInputReply(prevReplyInputs => ({
      ...prevReplyInputs,
      [commentId]: content
    }));
  }
  const handleUpdateInputReplyComment = (replyId, newContent) => {
    setCommentList((prevComments) => prevComments.map((comment) => {
      // Check if this is the comment containing the reply we updated
      if (comment.viewBlogReplies) {
        // Map through the replies to find and update the correct one
        const updatedReplies = comment.viewBlogReplies.map((reply) => {
          if (reply.idBlogReply === replyId) {
            // Found the reply we want to update
            return { ...reply, content: newContent };
          }
          return reply;
        });
        // Return the comment with the updated replies
        return { ...comment, viewBlogReplies: updatedReplies };
      }
      return comment;
    }));
  }
  const handleUpdateReply = (idBlogReply, content) => {
    blogInstance.put(`UpdateBlogReply/${idBlogReply}/${content}`)
      .then(() => {
        setUpdateReplyShow(null);
        setState(!state);
      }
      )
      .catch((error) => {
        console.error(error);
      })
  }
  //Hanlde like or unlike the the blog
  const handleLikeOrUnlikeBlog = () => {
    setData((prevData) => {
      // Determine the new like state and count
      const isLiked = !prevData.isLike;
      const newLikeCount = isLiked ? prevData.like + 1 : prevData.like - 1;

      return { ...prevData, isLike: isLiked, like: newLikeCount };
    });
    blogInstance.post(`LikeOrUnlikeBlog/${currentUserId}/${idBlog}`)
      .then(() => {
        // No need to update the state here if you're doing optimistic updates
      })
      .catch((error) => {
        // Revert the like state and count in case of an error
        console.error(error);
        setData((prevData) => {
          // Revert to the previous like state and count
          const revertedIsLiked = !prevData.isLike;
          const revertedLikeCount = revertedIsLiked ? prevData.like + 1 : prevData.like - 1;

          return { ...prevData, isLike: revertedIsLiked, like: revertedLikeCount };
        });
      });
  }
  //Fetch data
  const memoizedBlogInstance = useMemo(() => {
    return blogInstance; // hoặc tạo một instance mới nếu cần
  }, []);
  useEffect(() => {
    blogInstance.get(`GetAllCommentByBlog/${idBlog}/${currentUserId}`)
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
    memoizedBlogInstance.get(`GetBlogById/${idBlog}/${currentUserId}`)
      .then((res) => {
        setData(res?.data?.result);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [memoizedBlogInstance, idBlog]);

  //Fetch data the user to display in the comment and reply
  useEffect(() => {
    userInstance.get(`/GetUserById/${currentUserId}`)
      .then((res) => {
        setUser(res?.data?.result)
        // console.log(res?.data?.result.imageSrc);
      })
      .catch((err) => {
        console.log(err.response.data);
      })
  }, []);
  //Translate time from SQL to normal 
  const dateTime = calculateTimeDifference(data.createdDate);

  //Palce to log data to debug
  console.log(commentList)
  return (
    <div id="BlogDetail" className="p-3 mb-4">
      <div className="d-flex align-items-center mb-2">
        <img src={data.avatar} alt="profile" className="profile" />
        <div className="ms-2">
          <h6 className="mb-0">{data.fullName}</h6>
          <p className="mb-0">{dateTime}</p>
        </div>
      </div>
      <h3 className="fw-bold">{data.title}</h3>
      <p style={{ whiteSpace: 'pre-wrap' }}>
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
          <FaHeart className={`me-2 ${data.isLike ? 'red' : ''}`} /> {data.like}
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
        <img src={user?.imageSrc === 'https://localhost:7006/Images/' ? avatarDefault : user?.imageSrc} alt="" className="profile" />
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
            key={item?.id}
            className={`d-flex pb-3 mt-2 cmt-item ${item.type === "reply-comment" ? "ms-5" : ""
              }`}
          >
            <img src={item?.avatar === 'https://localhost:7006/Images/' ? avatarDefault : item?.avatar} alt="" className="profile" />
            <div className="ms-3  w-100 ">
              <div className="d-flex  justify-content-between">
                <h6 className="mb-2 d-flex align-items-center h-40">
                  {item.fullName}
                </h6>
                {item.idAccount === currentUserId ?
                  <Dropdown>
                    <Dropdown.Toggle id="dropdown-basic" style={{ border: 'none' }} className="bg-white border-none text-body">
                    </Dropdown.Toggle>

                    <Dropdown.Menu style={{ minWidth: 'auto' }}>
                      <Dropdown.Item onClick={() => handleUpdateCommentAppear(item.idBlogComment)}><GrUpdate /></Dropdown.Item>
                      <Dropdown.Item onClick={() => handleDeleteComment(item.idBlogComment)}><MdDelete /></Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown> : ""
                }
              </div>
              {updateShow !== item.idBlogComment ? (
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
                    <div className="d-flex justify-content-start align-items-center w-100 py-2">
                      {item.viewBlogReplies && (
                        item.viewBlogReplies.length === 0 ?
                          ''
                          :
                          <p onClick={() => handleViewReply(item.idBlogComment)}>View Reply</p>
                      )}
                    </div> :
                    <div className="d-flex justify-content-end align-items-center w-100  py-2">
                      <p onClick={() => handleViewReply(item.idBlogComment)}>Close</p>
                    </div>
                  }
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-end w-100 align-items-center" >
                  {replyComment === item.idBlogComment ?
                    <p onClick={() => handleShowReplyComment(item.idBlogComment)}>Reply</p> :
                    <div className="cmt-input d-flex align-items-center mt-2">
                      <img src={user?.imageSrc === 'https://localhost:7006/Images/' ? avatarDefault : user?.imageSrc} alt="" className="profile" />
                      <input
                        type="text"
                        className="w-100 ps-3"
                        placeholder="Type your Reply"
                        value={inputReply[item.idBlogComment] || ''}
                        onChange={(e) => handleInputReplyComment(item.idBlogComment, e.target.value)}

                      />
                      <VscSend style={{ fontSize: "30px" }}
                        onClick={() => handleCreateReplyComment(item.idBlogComment)}
                      />
                    </div>
                  }
                </div>
                {viewReply === item.idBlogComment ? (
                  item.viewBlogReplies.map((reply) => (
                    <>
                      <div className="d-flex">
                        <img src={reply.avatar === 'https://localhost:7006/Images/' ? avatarDefault : reply.avatar} alt="" className="profile reply-cmt" />
                        <div className="ms-3 w-100">
                          <h6 className="mb-2 d-flex align-items-center h-40 ms">
                            {reply.fullName}
                          </h6>
                          {updateReplyShow !== reply.idBlogReply ?
                            <p className="mb-0">{reply.content}</p> :
                            <div>
                              <input
                                type="text"
                                className="form-control"
                                value={reply.content}
                                onChange={(e) => handleUpdateInputReplyComment(reply.idBlogReply, e.target.value)}
                              />
                              <button onClick={() => handleUpdateReplyCancel(reply.idBlogReply)}>Cancel</button>
                              <button onClick={() => handleUpdateReply(reply.idBlogReply, reply.content)}>Save</button>
                            </div>
                          }
                        </div>
                        {reply.idAccount === currentUserId ?
                          <Dropdown style={{ width: 'auto' }}>
                            <Dropdown.Toggle id="dropdown-basic" style={{ border: 'none' }} className="bg-white border-none text-body">
                            </Dropdown.Toggle>

                            <Dropdown.Menu style={{ minWidth: 'auto' }}>
                              <Dropdown.Item onClick={() => handleUpdateReplyCommentAppear(reply.idBlogReply)}><GrUpdate /></Dropdown.Item>
                              <Dropdown.Item onClick={() => handleDeleteReplyComment(reply.idBlogReply)}><MdDelete /></Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown> : ""
                        }
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
