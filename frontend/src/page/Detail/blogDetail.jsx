import React, { useEffect, useState, useMemo, useRef } from "react";
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min";
import "./detail.scss";
import avatarDefault from "../../images/common/default.png";
import { FiEye } from "react-icons/fi";
import { VscSend } from "react-icons/vsc";
import { blogInstance, userInstance } from "../../axios/axiosConfig";
import { FaHeart } from "react-icons/fa";
import { GrUpdate } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import Dropdown from "react-bootstrap/Dropdown";
import { useLocation } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import SideBar from "../../components/sidebar";
import Follow from "../../components/follow";
import Report from "../../components/report-popup/Report";
import UpdateItem from "./Popup/UpdateItem";
import DeleteItem from "./Popup/DeleteItem";
import tick from "../../images/common/verifiedTick.png";
import Notification, {
  notifySuccess,
  notifyError,
} from "../../components/notification";
import { formatDistanceToNow, parseISO } from "date-fns";
import DeleteComment from "./Popup/DeleteComment";
import DeleteReplyComment from "./Popup/DeleteReplyComment";

function formatTimeAgo(dateString) {
  const result = formatDistanceToNow(parseISO(dateString), { addSuffix: true });
  // Loại bỏ từ "about" khỏi chuỗi
  return result.replace("about ", "");
}
function BlogDetail({ value, onSidebarClick }) {
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
  const sessionData = JSON.parse(sessionStorage.getItem("userSession")) || {};
  const { currentUserId, role } = sessionData;
  const location = useLocation();
  const { idBlog } = location.state || {};

  const [user, setUser] = useState({});
  const [data, setData] = useState({});
  const [content, setContent] = useState("");
  const [commentList, setCommentList] = useState([]);
  const [viewReply, setViewReply] = useState(null);
  const [state, setState] = useState(true);
  const [updateShow, setUpdateShow] = useState(null);
  const [originalContent, setOriginalContent] = useState("");
  const [updateReplyShow, setUpdateReplyShow] = useState(null);
  const [replyComment, setReplyComment] = useState(false);
  const [inputReply, setInputReply] = useState({});
  const [display, setDisplay] = useState(false);
  const [displayDelete, setDisplayDelete] = useState(false);
  const [reset, setReset] = useState(false);

  const [showDeleteComment, setShowDeleteComment] = useState(false);
  const [idDeleteComment, setIdDeleteComment] = useState(false);
  const [showDeleteReplyComment, setShowDeleteReplyComment] = useState(false);
  const [idDeleteReplyComment, setIdDeleteReplyComment] = useState(false);
  //__________________________________________________________________//

  const handleUpdateCommentAppear = (updateId, originalContent) => {
    setUpdateShow((prev) => (prev === updateId ? null : updateId));
    // If the original content is not set (i.e., it's an empty string), set it with the current content
    setOriginalContent(originalContent || "");
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
  };
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
    blogInstance
      .put(`UpdateBlogComment/${idBlogComment}/${content}`)
      .then(() => {
        setUpdateShow(null);
        setState(!state);
        notifySuccess("Update comment successfully!");
      })
      .catch((error) => {
        console.error(error);
        notifyError("Update comment failed!");
      });
  };
  const handleShowDeleteComment = (id) => {
    setIdDeleteComment(id);
    setShowDeleteComment(true);
  };
  const handleShowDeleteReplyComment = (id) => {
    setIdDeleteReplyComment(id);
    setShowDeleteReplyComment(true);
  };
  const handleInputComment = (event) => {
    setContent(event.target.value);
  };
  const handleUpdateInputComment = (commentId, newContent) => {
    setCommentList((prevComments) =>
      prevComments?.map((comment) =>
        comment.idBlogComment === commentId
          ? { ...comment, content: newContent }
          : comment
      )
    );
  };
  const handleCreateComment = () => {
    blogInstance
      .post(`CreateBlogComment/${currentUserId}/${idBlog}/${content}`, {
        headers: {
          accept: "application/json",
        },
      })
      .then((res) => {
        setState(!state);
        setContent("");
        console.log(res);
        notifySuccess("Create comment successfully!");
      })
      .catch((error) => {
        console.error(error);
        notifyError("Create comment failed!");
      });
  };
  const handleCreateReplyComment = (commentId) => {
    const replyContent = inputReply[commentId];

    // Perform the reply submission logic with replyContent
    // ...
    blogInstance
      .post(`CreateBlogReply/${currentUserId}/${commentId}/${replyContent}`)
      .then((res) => {
        setState(!state);

        console.log(res?.data?.result);
        notifySuccess("Create reply successfully!");
      })
      .catch((error) => {
        console.error(error);
        notifyError("Create reply failed!");
      });
    // After successful submission, clear the input field for that commentId
    setInputReply((prevReplyInputs) => ({
      ...prevReplyInputs,
      [commentId]: "", // This will clear the input field after submitting
    }));
  };

  const handleInputReplyComment = (commentId, content) => {
    setInputReply((prevReplyInputs) => ({
      ...prevReplyInputs,
      [commentId]: content,
    }));
  };
  const handleUpdateInputReplyComment = (replyId, newContent) => {
    setCommentList((prevComments) =>
      prevComments?.map((comment) => {
        // Check if this is the comment containing the reply we updated
        if (comment.viewBlogReplies) {
          // Map through the replies to find and update the correct one
          const updatedReplies = comment?.viewBlogReplies?.map((reply) => {
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
      })
    );
  };
  const handleUpdateReply = (idBlogReply, content) => {
    blogInstance
      .put(`UpdateBlogReply/${idBlogReply}/${content}`)
      .then(() => {
        setUpdateReplyShow(null);
        setState(!state);
        notifySuccess("Update reply successfully!");
      })
      .catch((error) => {
        console.error(error);
        notifyError("Update reply failed!");
      });
  };
  //Hanlde like or unlike the the blog
  const handleLikeOrUnlikeBlog = () => {
    setData((prevData) => {
      // Determine the new like state and count
      const isLiked = !prevData.isLike;
      const newLikeCount = isLiked ? prevData.like + 1 : prevData.like - 1;

      return { ...prevData, isLike: isLiked, like: newLikeCount };
    });
    blogInstance
      .post(`LikeOrUnlikeBlog/${currentUserId}/${idBlog}`)
      .then(() => {
        // No need to update the state here if you're doing optimistic updates
      })
      .catch((error) => {
        // Revert the like state and count in case of an error
        console.error(error);
        setData((prevData) => {
          // Revert to the previous like state and count
          const revertedIsLiked = !prevData.isLike;
          const revertedLikeCount = revertedIsLiked
            ? prevData.like + 1
            : prevData.like - 1;
          return {
            ...prevData,
            isLike: revertedIsLiked,
            like: revertedLikeCount,
          };
        });
      });
  };
  const handleLikeOrUnlikeBlogCmt = (idBlogComment) => {
    setCommentList((prevCommentList) =>
      prevCommentList?.map((comment) => {
        if (comment.idBlogComment === idBlogComment) {
          // Update the like state and count for this comment
          const isLiked = !comment.isLike;
          const newLikeCount = isLiked ? comment.like + 1 : comment.like - 1;

          // Return the updated comment object
          return { ...comment, isLike: isLiked, like: newLikeCount };
        }

        // Return the comment object unchanged
        return comment;
      })
    );
    blogInstance
      .post(`LikeOrUnlikeBlogComment/${currentUserId}/${idBlogComment}`)
      .then(() => {
        // No need to update the state here if you're doing optimistic updates
      })
      .catch((error) => {
        // Revert the like state and count in case of an error
        console.error(error);
        setCommentList((prevCommentList) =>
          prevCommentList?.map((comment) => {
            if (comment.idBlogComment === idBlogComment) {
              // Revert to the previous like state and count for this comment
              const revertedIsLiked = !comment.isLike;
              const revertedLikeCount = revertedIsLiked
                ? comment.like + 1
                : comment.like - 1;

              // Return the reverted comment object
              return {
                ...comment,
                isLike: revertedIsLiked,
                like: revertedLikeCount,
              };
            }

            // Return the comment object unchanged
            return comment;
          })
        );
      });
  };
  const handleLikeOrUnlikeBlogReply = (idBlogReply) => {
    setCommentList((prevCommentList) =>
      prevCommentList?.map((comment) => {
        if (comment.viewBlogReplies) {
          const updatedReplies = comment?.viewBlogReplies?.map((reply) => {
            if (reply.idBlogReply === idBlogReply) {
              // Update the like state and count for this reply
              const isLiked = !reply.isLike;
              const newLikeCount = isLiked ? reply.like + 1 : reply.like - 1;

              // Return the updated reply object
              return { ...reply, isLike: isLiked, like: newLikeCount };
            }

            // Return the reply object unchanged
            return reply;
          });

          // Return the comment with updated replies
          return { ...comment, viewBlogReplies: updatedReplies };
        }

        // Return the comment object unchanged
        return comment;
      })
    );

    blogInstance
      .post(`LikeOrUnlikeBlogReply/${currentUserId}/${idBlogReply}`)
      .then(() => {
        // No need to update the state here if you're doing optimistic updates
      })
      .catch((error) => {
        // Revert the like state and count in case of an error
        console.error(error);
        setCommentList((prevCommentList) =>
          prevCommentList?.map((comment) => {
            if (comment.viewBlogReplies) {
              const revertedReplies = comment.viewBlogReplies?.map((reply) => {
                if (reply.idBlogReply === idBlogReply) {
                  // Revert to the previous like state and count for this reply
                  const revertedIsLiked = !reply.isLike;
                  const revertedLikeCount = revertedIsLiked
                    ? reply.like + 1
                    : reply.like - 1;

                  // Return the reverted reply object
                  return {
                    ...reply,
                    isLike: revertedIsLiked,
                    like: revertedLikeCount,
                  };
                }
                // Return the reply object unchanged
                return reply;
              });
              // Return the comment with reverted replies
              return { ...comment, viewBlogReplies: revertedReplies };
            }
            // Return the comment object unchanged
            return comment;
          })
        );
      });
  };
  //Fetch data
  const memoizedBlogInstance = useMemo(() => {
    return blogInstance; // hoặc tạo một instance mới nếu cần
  }, []);
  useEffect(() => {
    blogInstance
      .get(`GetAllCommentByBlog/${idBlog}/${currentUserId}`)
      .then((res) => {
        setCommentList(res?.data?.result);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [state]);

  useEffect(() => {
    memoizedBlogInstance
      .get(`GetBlogById/${idBlog}/${currentUserId}`)
      .then((res) => {
        const blog = res?.data?.result;
        setData(res?.data?.result);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [memoizedBlogInstance, idBlog, reset]);

  //Fetch data the user to display in the comment and reply
  useEffect(() => {
    userInstance
      .get(`/GetUserById/${currentUserId}`)
      .then((res) => {
        setUser(res?.data?.result);
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  }, []);
  //Translate time from SQL to normal
  let dateTime;
  if (data?.createdDate && typeof data.createdDate === "string") {
    dateTime = formatTimeAgo(data.createdDate);
  } else {
    // Handle the case when createdDate is undefined or not a string
    dateTime = "Unknown date";
  }
  const handleUpdateBlog = () => {
    setDisplay(true);
  };
  const handleDeleteBlog = () => {
    setDisplayDelete(true);
  };
  const resetPage = () => {
    setReset((prev) => !prev);
  };
  const setResetCmt = () => {
    setState((prev) => !prev);
  };
  const itemClick = () => {
    onSidebarClick();
  };
  //Palce to log data to debug
  return (
    <Row className="pt-3 ms-0 me-0">
      <Col md={3}>
        <SideBar itemClick={itemClick} />
      </Col>
      <Col md={6}>
        <div id="BlogDetail" className="p-3 mb-4">
          <div className="d-flex align-items-between justify-content-between mb-2">
            <div className="d-flex align-items-between">
              <div className="position-relative">
                <div className="profile">
                  <img src={data.avatar} alt="profile" />
                </div>
                {data.isVerified && (
                  <img
                    src={tick}
                    alt="tick"
                    className="position-absolute bottom-0 end-0"
                    style={{ width: "18px" }}
                  />
                )}
              </div>
              <div className="ms-2">
                <h6 className="mb-0">{data.fullName}</h6>
                <p className="mb-0">{dateTime}</p>
              </div>
            </div>
            {data?.idAccount === currentUserId ? (
              <Dropdown>
                <Dropdown.Toggle
                  id="dropdown-basic"
                  style={{ border: "none" }}
                  className="bg-custom border-none text-body"
                >
                  <BsThreeDots
                    style={{ color: "var(--header_search_text)" }}
                    size={28}
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu style={{ minWidth: "auto" }}>
                  <Dropdown.Item
                    className="d-flex justify-content-center"
                    onClick={() => handleUpdateBlog()}
                  >
                    <GrUpdate />
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="d-flex justify-content-center"
                    onClick={() => handleDeleteBlog()}
                  >
                    <MdDelete />
                  </Dropdown.Item>
                  {role !== "Admin" && (
                    <Dropdown.Item>
                      <Report />
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <div>{role !== "Admin" && <Report />}</div>
            )}
          </div>
          <UpdateItem
            show={display}
            onClose={() => setDisplay(false)}
            value={data}
            type={"blog"}
            resetPage={resetPage}
          />
          <DeleteItem
            show={displayDelete}
            onClose={() => setDisplayDelete(false)}
            value={data?.idBlog}
            type={"blog"}
          />
          <h3 className="fw-bold">{data.title}</h3>
          <div dangerouslySetInnerHTML={{ __html: data.content }} />
          <div
            id={`carouselExampleControls-${data.id}`}
            className="carousel slide"
            data-bs-ride="carousel"
            ref={carouselRef} // Thêm tham chiếu này
          >
            <div className="carousel-inner">
              {data.viewBlogImages?.map((items, index) => (
                <div className={`carousel-item ${index === 0 ? "active" : ""}`}>
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

            {data.viewBlogImages?.length > 1 && (
              <>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target={`#carouselExampleControls-${data.id}`}
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
                  data-bs-target={`#carouselExampleControls-${data.id}`}
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
          <div className="d-flex align-items-center border-custom pb-3 mt-2">
            <div className="d-flex align-items-center me-3">
              <FiEye className="me-2" /> {data.view + 1}
            </div>
            <div
              className="d-flex align-items-center me-3"
              onClick={() => handleLikeOrUnlikeBlog()}
            >
              <FaHeart className={`me-2 ${data.isLike ? "red" : ""}`} />{" "}
              {data.like}
            </div>
          </div>
          <p className="cmt fw-bold my-3">COMMENT</p>
          <div className="cmt-input d-flex align-items-center">
            {/* <img src={user?.imageSrc === 'https://localhost:7006/Images/' ? avatarDefault : user?.imageSrc} alt="" className="profile" /> */}
            <div className="position-relative">
              <div className="profile">
                <img src={user?.imageSrc} alt="profile" />
              </div>
              {user?.isVerified && (
                <img
                  src={tick}
                  alt="tick"
                  className="position-absolute bottom-0 end-0"
                  style={{ width: "18px" }}
                />
              )}
            </div>
            <input
              type="text"
              className="w-100 ps-3 input-cmt"
              placeholder="Type your comment"
              value={content}
              onChange={handleInputComment}
            />
            <VscSend
              style={{ fontSize: "30px" }}
              onClick={handleCreateComment}
            />
          </div>
          <div className="cmt-block">
            <DeleteComment
              id={idDeleteComment}
              show={showDeleteComment}
              type={"blog"}
              onClose={() => setShowDeleteComment(false)}
              setResetCmt={setResetCmt}
            />
            <DeleteReplyComment
              id={idDeleteReplyComment}
              show={showDeleteReplyComment}
              type={"blog"}
              onClose={() => setShowDeleteReplyComment(false)}
              setResetCmt={setResetCmt}
            />
            {commentList?.map((item) => (
              <div
                key={item?.id}
                className={`d-flex pb-3 mt-2 cmt-item ${
                  item.type === "reply-comment" ? "ms-5" : ""
                }`}
              >
                <div className="position-relative" style={{ height: "50px" }}>
                  <div className="profile">
                    <img src={item?.avatar} alt="profile" />
                  </div>
                  {item?.isVerified && (
                    <img
                      src={tick}
                      alt="tick"
                      className="position-absolute bottom-0 end-0"
                      style={{ width: "18px" }}
                    />
                  )}
                </div>
                <div className="ms-3  w-100 ">
                  <div className="form-control view-cmt">
                    <div className="d-flex  justify-content-between">
                      <h6 className="mb-2 d-flex align-items-center h-40">
                        {item.fullName}
                      </h6>
                      {item.idAccount === currentUserId ? (
                        <Dropdown>
                          <Dropdown.Toggle
                            id="dropdown-basic"
                            style={{ border: "none" }}
                            className="dropdown-custom border-none text-body"
                          >
                            <BsThreeDots />
                          </Dropdown.Toggle>

                          <Dropdown.Menu style={{ minWidth: "auto" }}>
                            <Dropdown.Item
                              onClick={() =>
                                handleUpdateCommentAppear(item.idBlogComment)
                              }
                            >
                              <GrUpdate />
                            </Dropdown.Item>
                            <Dropdown.Item
                              onClick={() =>
                                handleShowDeleteComment(item.idBlogComment)
                              }
                            >
                              <MdDelete />
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      ) : (
                        ""
                      )}
                    </div>
                    {updateShow !== item.idBlogComment ? (
                      <div>
                        <p className="mb-0">{item.content}</p>
                        <div
                          className="d-flex align-items-center me-3"
                          onClick={() =>
                            handleLikeOrUnlikeBlogCmt(item.idBlogComment)
                          }
                        >
                          <FaHeart
                            className={`me-2 ${
                              item?.isLike === true ? "red" : ""
                            }`}
                          />{" "}
                          {item?.like}
                        </div>
                      </div>
                    ) : (
                      <>
                        <input
                          type="text"
                          className="form-control mb-2 input-cmt"
                          value={originalContent || item.content}
                          onChange={(e) =>
                            handleUpdateInputComment(
                              item.idBlogComment,
                              e.target.value
                            )
                          }
                        />
                        <button
                          className="btn btn-outline-primary"
                          onClick={() =>
                            handleUpdateCommentCancel(item.idBlogComment)
                          }
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-outline-info ms-3"
                          onClick={() =>
                            handleUpdateComment(
                              item.idBlogComment,
                              item.content
                            )
                          }
                        >
                          Save
                        </button>
                      </>
                    )}
                  </div>
                  <div className="rep d-flex w-100">
                    <div
                      className={`d-flex justify-content-between w-100 align-items-center ${
                        viewReply !== item.idBlogComment
                          ? "justify-content-end"
                          : "justify-content-between"
                      }`}
                    >
                      {viewReply !== item.idBlogComment ? (
                        <div className="d-flex justify-content-start align-items-center w-100 py-2">
                          {item.viewBlogReplies &&
                            (item.viewBlogReplies.length === 0 ? (
                              ""
                            ) : (
                              <p
                                className="btn btn-primary"
                                onClick={() =>
                                  handleViewReply(item.idBlogComment)
                                }
                              >
                                View Reply
                              </p>
                            ))}
                        </div>
                      ) : (
                        <div className="d-flex justify-content-end align-items-center w-100  py-2">
                          <p
                            className="btn btn-danger"
                            onClick={() => handleViewReply(item.idBlogComment)}
                          >
                            Close
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="d-flex justify-content-end w-100 align-items-center">
                      {replyComment === item.idBlogComment ? (
                        <p
                          onClick={() =>
                            handleShowReplyComment(item.idBlogComment)
                          }
                        >
                          Reply
                        </p>
                      ) : (
                        <div className="cmt-input d-flex align-items-center mt-2">
                          <div className="position-relative">
                            <div className="profile">
                              <img src={user?.imageSrc} alt="profile" />
                            </div>
                            {user?.isVerified && (
                              <img
                                src={tick}
                                alt="tick"
                                className="position-absolute bottom-0 end-0"
                                style={{ width: "18px" }}
                              />
                            )}
                          </div>
                          <input
                            type="text"
                            className="w-100 ps-3 input-cmt"
                            placeholder="Type your Reply"
                            value={inputReply[item.idBlogComment] || ""}
                            onChange={(e) =>
                              handleInputReplyComment(
                                item.idBlogComment,
                                e.target.value
                              )
                            }
                          />
                          <VscSend
                            style={{ fontSize: "30px" }}
                            onClick={() =>
                              handleCreateReplyComment(item.idBlogComment)
                            }
                          />
                        </div>
                      )}
                    </div>
                    {viewReply === item.idBlogComment
                      ? item?.viewBlogReplies?.map((reply) => (
                          <>
                            <div className="d-flex cmt-input mt-2">
                              <div
                                className="position-relative"
                                style={{ height: "50px" }}
                              >
                                <div className="profile">
                                  <img src={reply?.avatar} alt="profile" />
                                </div>
                                {item?.isVerified && (
                                  <img
                                    src={tick}
                                    alt="tick"
                                    className="position-absolute bottom-0 end-0"
                                    style={{ width: "18px" }}
                                  />
                                )}
                              </div>
                              <div className="ms-3 w-100">
                                <h6 className="mb-2 d-flex align-items-center h-40 ms">
                                  {reply.fullName}
                                </h6>
                                {updateReplyShow !== reply.idBlogReply ? (
                                  <div>
                                    <p className="mb-0">{reply.content}</p>
                                    <div
                                      className="d-flex align-items-center me-3"
                                      onClick={() =>
                                        handleLikeOrUnlikeBlogReply(
                                          reply.idBlogReply
                                        )
                                      }
                                    >
                                      <FaHeart
                                        className={`me-2 ${
                                          reply?.isLike === true ? "red" : ""
                                        }`}
                                      />{" "}
                                      {reply?.like}
                                    </div>
                                  </div>
                                ) : (
                                  <div>
                                    <input
                                      type="text"
                                      className="form-control mb-2 input-cmt"
                                      value={reply.content}
                                      onChange={(e) =>
                                        handleUpdateInputReplyComment(
                                          reply.idBlogReply,
                                          e.target.value
                                        )
                                      }
                                    />
                                    <button
                                      className="btn btn-outline-primary"
                                      onClick={() =>
                                        handleUpdateReplyCancel(
                                          reply.idBlogReply
                                        )
                                      }
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      className="ms-3 btn btn-outline-info"
                                      onClick={() =>
                                        handleUpdateReply(
                                          reply.idBlogReply,
                                          reply.content
                                        )
                                      }
                                    >
                                      Save
                                    </button>
                                  </div>
                                )}
                              </div>
                              {reply.idAccount === currentUserId ? (
                                <Dropdown style={{ width: "auto" }}>
                                  <Dropdown.Toggle
                                    id="dropdown-basic"
                                    style={{ border: "none" }}
                                    className="dropdown-custom border-none text-body"
                                  >
                                    <BsThreeDots />
                                  </Dropdown.Toggle>

                                  <Dropdown.Menu style={{ minWidth: "auto" }}>
                                    <Dropdown.Item
                                      onClick={() =>
                                        handleUpdateReplyCommentAppear(
                                          reply.idBlogReply
                                        )
                                      }
                                    >
                                      <GrUpdate />
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                      onClick={() =>
                                        handleShowDeleteReplyComment(
                                          reply.idBlogReply
                                        )
                                      }
                                    >
                                      <MdDelete />
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              ) : (
                                ""
                              )}
                            </div>
                          </>
                        ))
                      : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Col>
      <Col md={3}>
        <Follow followValue={value} />
      </Col>
    </Row>
  );
}

export default BlogDetail;
