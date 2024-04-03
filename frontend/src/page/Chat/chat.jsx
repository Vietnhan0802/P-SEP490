import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { IoSearchSharp } from "react-icons/io5";
import { LuSendHorizonal } from "react-icons/lu";
import defaultImage from "../../images/common/default.png";
import "../Chat/chat.scss";
import Nolan from "../../images/chat/Nolan.png";
import Angel from "../../images/chat/Angel.png";
import Davis from "../../images/chat/Davis.png";
import Desirae from "../../images/chat/Desirae.png";
import Ryan from "../../images/chat/Ryan.png";
import Roger from "../../images/chat/Roger.png";
import Carla from "../../images/chat/Carla.png";
import Brandon from "../../images/chat/Brandon.png";
import { FaRegFolder } from "react-icons/fa";
import { FaRegImage } from "react-icons/fa6";
import { FaLink } from "react-icons/fa6";
import { LuSmile } from "react-icons/lu";
import { chatInstance } from "../../axios/axiosConfig";
import * as signalR from "@microsoft/signalr";
import { useLocation } from "react-router-dom";
function Chat() {

  const sessionData = JSON.parse(sessionStorage.getItem("userSession")) || {};
  const { currentUserId } = sessionData;
  const location = useLocation();
  const { userId } = location.state || {};
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [firstChat, setFirstChat] = useState(false);
  useEffect(() => {
    chatInstance.get(`GetConversationsByUser/${currentUserId}`)
      .then((res) => {
        setConversations(res.data.result);

        handleConversation(res?.data?.result[0]?.idConversation);
        console.log(res.data.result);
      })
      .catch((error) => {
        console.error(error);
      })
  }, [currentUserId]);

  const handleConversation = (idConversation) => {
    chatInstance.get(`GetMessages/${idConversation}/${currentUserId}`)
      .then((res) => {
        setMessages(res.data.result);
        console.log(res.data.result);
      })
      .catch((error) => {
        console.error(error);
      })
  };
  if (userId !== undefined) {
    chatInstance.post(`CreateConversation/${currentUserId}/${userId}`)
      .then((res) => {
        console.log(res?.data?.result);
      })
      .catch((error) => {
        console.error(error);
      })
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays < 7) {
      // Nếu thời gian nhỏ hơn 7 ngày so với hiện tại, hiển thị thứ
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayOfWeek = daysOfWeek[date.getDay()];
      const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `${dayOfWeek}, ${time}`;
    } else {
      // Ngược lại, hiển thị ngày
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `${day}/${month}/${year}, ${time}`;
    }
  };

  return (

    <Row className="m-3" style={{ height: "calc(100vh - 97px)", paddingBottom: "16px" }}>
      <Col md={2} className="bg-custom bg-white p-3 h-100">
        <div id="chat">
          <h1>Chat</h1>
          <div className="chat-search ">
            <div className="d-flex align-items-center">
              <IoSearchSharp className="me-2 icon-search" />
              <input className="bg-search" type="text" placeholder="Search" />
            </div>
          </div>
          <div className="chat-list">
            {conversations?.length > 0 ? (
              conversations?.map((item) => (
                <div className="chat-item" key={item?.idConversation} onClick={() => handleConversation(item?.idConversation)}>
                  <div className="d-flex align-items-center" >
                    <img src={item?.avatar === "https://localhost:7006/Images/" ? defaultImage : item?.avatar} alt="" className="avatar" />
                    <div className="ms-2">
                      <p className="mb-0 name">{item?.fullName}</p>
                      <p className="mb-0 text">This is a text</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="ms-2"></div>
                  </div>
                </div>
              ))
            ) : (
              <p>No conversations found.</p>
            )}
          </div>
        </div>
      </Col>
      <Col md={10} className="pe-0">
        <div id="chat-box" className="bg-white ms-3 position-relative">
          <div className="chat-box-header">
            <div className="d-flex align-items-center p-3">
              {conversations?.length > 0 && (
                <>
                  <img
                    src={
                      (conversations[0]?.avatar === "https://localhost:7006/Images/"
                        ? defaultImage
                        : conversations[0]?.avatar) || ""
                    }
                    alt=""
                    className="avatar"
                  />
                  <div className="ms-2">
                    <p className="mb-0 name">{conversations[0]?.fullName || ""}</p>
                    <p className="mb-0 text">Online</p>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="chat-box-body">
            {messages?.map((item) => (
              <div key={item?.idMessage}
                style={{ marginTop: "22px" }}
                className={`chat-content ${item?.isYourself ? "d-flex justify-content-end" : ""
                  }`}
              >
                <div>
                  <div
                    className="d-flex align-items-center p-3"
                    style={{ width: "500px" }}
                  >
                    {item?.isYourself ? (
                      ""
                    ) : (
                      <img src={item.avatarReceiver === "https://localhost:7006/Images/" ? defaultImage : item?.avatarReceiver} alt="" className="avatar" />
                    )}
                    <div className="ms-2 w-100">
                      <div className="d-flex justify-content-between">
                        <p className="mb-0 name">{item?.nameReceiver}</p>
                        <p className="mb-0 text">{formatDate(item?.createdDate)}</p>
                      </div>
                      <p
                        className={`mb ${item?.isYourself ? "self-content" : "content"
                          }`}
                      >
                        {item?.content}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="chat-box-input position-absolute bottom-0 w-100">
            <div className="w-100 d-flex justify-content-center icon-chat">
              <div className="w-auto fw-bold fs-3 icon-item">
                <FaRegFolder className="mx-3" />
                <FaRegImage className="mx-3" />
                <FaLink className="mx-3" />
                <LuSmile className="mx-3" />
              </div>
            </div>
            <div className="d-flex align-items-center p-3 w-100">
              <div className="cover">
                <input
                  type="text"
                  placeholder="Message"
                  className="w-100 input-chat"
                />
              </div>
              <button
                className="btn btn-primary ms-3 d-flex align-items-center p-3"
              // style={{ height: "40px" }}
              >
                <LuSendHorizonal />
              </button>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
}

export default Chat;
