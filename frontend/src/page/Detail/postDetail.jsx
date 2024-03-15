import React, { useEffect, useMemo, useState } from "react";
import "./detail.scss";
import defaultAvatar from "../../images/common/default.png"

import avatarDefault from "../../images/common/default.png";

import { VscSend } from "react-icons/vsc";
import { postInstance, userInstance } from "../../axios/axiosConfig";
import Dropdown from 'react-bootstrap/Dropdown';
import { GrUpdate } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import PostContent from "./PostContent";
import { useLocation } from "react-router-dom";

function PostDetail() {

  const location = useLocation();
  const sessionData = JSON.parse(sessionStorage.getItem('userSession')) || {};
  const { currentUserId } = sessionData;
  const  {idPost}  = location.state || {};


  const [data, setData] = useState();
  const [user, setUser] = useState({});
  const [commentList, setCommentList] = useState([]);
  const [content, setContent] = useState('');
  const [viewReply, setViewReply] = useState(null);
  const [state, setState] = useState(true)
  const [updateShow, setUpdateShow] = useState(null);
  const [originalContent, setOriginalContent] = useState('');
  const [updateReplyShow, setUpdateReplyShow] = useState(null);
  const [replyComment, setReplyComment] = useState(false);
  const [inputReply, setInputReply] = useState({});

  // console.log(data)
  const memoizedPostInstance = useMemo(() => {
    return postInstance; // hoặc tạo một instance mới nếu cần
  }, []);

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
  const handleUpdateComment = (idPostComment, content) => {
    postInstance.put(`UpdatePostComment/${idPostComment}/${content}`)
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
    postInstance.delete(`RemovePostComment/${id}`)
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
    postInstance.delete(`RemovePostReply/${id}`)
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
        comment.idPostComment === commentId
          ? { ...comment, content: newContent }
          : comment
      )
    );
  };
  const handleCreateComment = () => {
    postInstance.post(`CreatePostComment/${currentUserId}/${idPost}/${content}`, {
      headers: {
        accept: 'application/json'
      }
    })
      .then((res) => {
        setContent('');
        setState(!state);
        console.log(res)
      })
      .catch((error) => { console.error(error) });
  }
  const handleCreateReplyComment = (commentId) => {
    const replyContent = inputReply[commentId];

    // Perform the reply submission logic with replyContent
    // ...
    postInstance.post(`CreatePostReply/${currentUserId}/${commentId}/${replyContent}`)
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
      if (comment.viewPostReplies) {
        // Map through the replies to find and update the correct one
        const updatedReplies = comment.viewPostReplies.map((reply) => {
          if (reply.idPostReply === replyId) {
            // Found the reply we want to update
            return { ...reply, content: newContent };
          }
          return reply;
        });
        // Return the comment with the updated replies
        return { ...comment, viewPostReplies: updatedReplies };
      }
      return comment;
    }));
  }
  const handleUpdateReply = (idPostReply, content) => {
    postInstance.put(`UpdatePostReply/${idPostReply}/${content}`)
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
  const handleLikeOrUnlikePost = () => {
    setData((prevData) => {
      // Determine the new like state and count
      const isLiked = !prevData.isLike;
      const newLikeCount = isLiked ? prevData.like + 1 : prevData.like - 1;

      return { ...prevData, isLike: isLiked, like: newLikeCount };
    });
    postInstance.post(`LikeOrUnlikePost/${currentUserId}/${idPost}`)
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

  useEffect(() => {
    postInstance.get(`GetAllPostComments/${idPost}/${currentUserId}`)
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
    memoizedPostInstance.get(`GetPostById/${idPost}/${currentUserId}`)
      .then((res) => {
        setData(res?.data?.result);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [memoizedPostInstance, idPost]);
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
  // const viewProject =(value)=>{
  //   if(value !==null){
  //     viewProjectDetail(value);
  //   }
  // }
  return (
    <div id="postDetail" className="p-3">
      <PostContent data={data} handleLikeOrUnlikePost={handleLikeOrUnlikePost} />
      <p className="cmt fw-bold my-3">COMMENT</p>
      <div className="cmt-input d-flex ">
        <img src={data?.avatar === "https://localhost:7006/Images/" ? defaultAvatar : data?.avatar} alt="" className="profile" />
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
                      <Dropdown.Item onClick={() => handleUpdateCommentAppear(item.idPostComment)}><GrUpdate /></Dropdown.Item>
                      <Dropdown.Item onClick={() => handleDeleteComment(item.idPostComment)}><MdDelete /></Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown> : ""
                }
              </div>
              {updateShow !== item.idPostComment ? (
                <p className="mb-0">{item.content}</p>
              ) : (
                <>
                  <input
                    type="text"
                    className="form-control"
                    value={originalContent || item.content}
                    onChange={(e) => handleUpdateInputComment(item.idPostComment, e.target.value)}
                  />
                  <button onClick={() => handleUpdateCommentCancel(item.idPostComment)}>Cancel</button>
                  <button onClick={() => handleUpdateComment(item.idPostComment, item.content)}>Save</button>
                </>
              )}
              <div className="rep d-flex w-100" >
                <div className={`d-flex justify-content-between w-100 align-items-center ${viewReply !== item.idPostComment ? 'justify-content-end' : "justify-content-between"}`}>
                  {viewReply !== item.idPostComment ?
                    <div className="d-flex justify-content-start align-items-center w-100 py-2">
                      {item.viewPostReplies && (
                        item.viewPostReplies.length === 0 ?
                          ''
                          :
                          <p onClick={() => handleViewReply(item.idPostComment)}>View Reply</p>
                      )}
                    </div> :
                    <div className="d-flex justify-content-end align-items-center w-100  py-2">
                      <p onClick={() => handleViewReply(item.idPostComment)}>Close</p>
                    </div>
                  }
                </div>
              </div>
              <div>
                <div className="d-flex justify-content-end w-100 align-items-center" >
                  {replyComment === item.idPostComment ?
                    <p onClick={() => handleShowReplyComment(item.idPostComment)}>Reply</p> :
                    <div className="cmt-input d-flex align-items-center mt-2">
                      <img src={user?.imageSrc === 'https://localhost:7006/Images/' ? avatarDefault : user?.imageSrc} alt="" className="profile" />
                      <input
                        type="text"
                        className="w-100 ps-3"
                        placeholder="Type your Reply"
                        value={inputReply[item.idPostComment] || ''}
                        onChange={(e) => handleInputReplyComment(item.idPostComment, e.target.value)}

                      />
                      <VscSend style={{ fontSize: "30px" }}
                        onClick={() => handleCreateReplyComment(item.idPostComment)}
                      />
                    </div>
                  }
                </div>
                {viewReply === item.idPostComment ? (
                  item.viewPostReplies.map((reply) => (
                    <>
                      <div className="d-flex">
                        <img src={reply.avatar === 'https://localhost:7006/Images/' ? avatarDefault : reply.avatar} alt="" className="profile reply-cmt" />
                        <div className="ms-3 w-100">
                          <h6 className="mb-2 d-flex align-items-center h-40 ms">
                            {reply.fullName}
                          </h6>
                          {updateReplyShow !== reply.idPostReply ?
                            <p className="mb-0">{reply.content}</p> :
                            <div>
                              <input
                                type="text"
                                className="form-control"
                                value={reply.content}
                                onChange={(e) => handleUpdateInputReplyComment(reply.idPostReply, e.target.value)}
                              />
                              <button onClick={() => handleUpdateReplyCancel(reply.idPostReply)}>Cancel</button>
                              <button onClick={() => handleUpdateReply(reply.idPostReply, reply.content)}>Save</button>
                            </div>
                          }
                        </div>
                        {reply.idAccount === currentUserId ?
                          <Dropdown style={{ width: 'auto' }}>
                            <Dropdown.Toggle id="dropdown-basic" style={{ border: 'none' }} className="bg-white border-none text-body">
                            </Dropdown.Toggle>

                            <Dropdown.Menu style={{ minWidth: 'auto' }}>
                              <Dropdown.Item onClick={() => handleUpdateReplyCommentAppear(reply.idPostReply)}><GrUpdate /></Dropdown.Item>
                              <Dropdown.Item onClick={() => handleDeleteReplyComment(reply.idPostReply)}><MdDelete /></Dropdown.Item>
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

export default PostDetail;
