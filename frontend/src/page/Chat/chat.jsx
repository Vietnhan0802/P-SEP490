import React, { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { IoSearchSharp } from "react-icons/io5";
import { LuSendHorizonal } from "react-icons/lu";
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
function Chat() {
  const chatList = [
    { id: 1, name: "Nolan Bator", img: Nolan, text: "Justin Schleifer" },
    { id: 2, name: "Angel Mango", img: Angel, text: "Charlie Kenter" },
    { id: 3, name: "Davis Rhiel", img: Davis, text: "Craig Herwitz" },
    { id: 4, name: "Desirae Lubin", img: Desirae, text: "Ashlynn George" },
    { id: 5, name: "Ryan Dokidis", img: Ryan, text: "Cristofer Press" },
    { id: 6, name: "Roger Stanton", img: Roger, text: "Terry Vetrovs" },
    { id: 7, name: "Carla Septimus", img: Carla, text: "Maria Vaccaro" },
    { id: 8, name: "Brandon Philips", img: Brandon, text: "Justin Schleifer" },
  ];
  const chatContent = [
    {
      id: 1,
      name: "Davis Rhiel",
      time: "Friday 2:20pm",
      img: Davis,
      content:
        "Hey Olivia, can you please review the latest design when you can?",
    },
    {
      id: 0,
      name: "You",
      time: "Friday 2:22pm",
      img: null,
      content: "Sure thing, I’ll have a look today.",
    },
    {
      id: 1,
      name: "Davis Rhiel",
      time: "Friday 2:32pm",
      img: Davis,
      content: "Is everything OK?",
    },
    {
      id: 0,
      name: "You",
      time: "Friday 2:33pm",
      img: null,
      content: "It is awesome! Thanks.",
    },
  ];

  // const sessionData = JSON.parse(sessionStorage.getItem("userSession")) || {};
  // const { currentUserId } = sessionData;

  // const [connection, setConnection] = useState(null);

  // useEffect(() => {
  //   const newConnection = new signalR.HubConnectionBuilder()
  //     .withUrl('https://localhost:7001/chathub')
  //     .withAutomaticReconnect()
  //     .build();

  //   setConnection(newConnection);
  // }, []);

  // useEffect(() => {
  //   if (connection) {
  //     connection.start()
  //       .then(() => {
  //         console.log('SignalR Connected');

  //         // Đăng ký các phương thức xử lý sự kiện SignalR
  //         connection.on('ReceiveMessage', (message) => {
  //           // Xử lý nhận tin nhắn
  //           console.log('Received message:', message);
  //         });

  //         connection.on('RecallMessage', (messageId) => {
  //           // Xử lý thu hồi tin nhắn
  //           console.log('Recalled message:', messageId);
  //         });

  //         // Đăng ký các sự kiện khác nếu cần
  //       })
  //       .catch(error => {
  //         console.log('SignalR Connection Error: ', error);
  //       });
  //   }
  // }, [connection]);

  // const sendMessage = async (idCurrentUser, idReceiver, idConversation, content) => {
  //   try {
  //     const response = await axios.post(`/api/Chat/SendMessage/${idCurrentUser}/${idReceiver}/${idConversation}`, { content });
  //     // Xử lý kết quả trả về từ API nếu cần
  //     console.log(response.data);
  //   } catch (error) {
  //     console.error('Error sending message:', error);
  //   }
  // };
  
  // const deleteMessage = async (idMessage, idCurrentUser) => {
  //   try {
  //     const response = await axios.delete(`/api/Chat/DeleteMessage/${idMessage}/${idCurrentUser}`);
  //     // Xử lý kết quả trả về từ API nếu cần
  //     console.log(response.data);
  //   } catch (error) {
  //     console.error('Error deleting message:', error);
  //   }
  // };
  return (

      <Row className="m-3"  style={{ height: "calc(100vh - 97px)",paddingBottom:"16px" }}>
        <Col md={2} className="bg-custom bg-white p-3 h-100">
          <div id="chat">
            <h1>Chat</h1>
            <div className="chat-search ">
              <div className="d-flex align-items-center">
                <IoSearchSharp className="me-2 icon-search" />
                <input className="bg-search" type="text" placeholder="Search"/>
              </div>
            </div>
            <div className="chat-list">
              {chatList.map((item) => (
                <div className="chat-item">
                  <div className="d-flex align-items-center">
                    <img src={item.img} alt="" className="avatar" />
                    <div className="ms-2">
                      <p className="mb-0 name">{item.name}</p>
                      <p className="mb-0 text">{item.text}</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <div className="ms-2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Col>
        <Col md={10} className="pe-0">
          <div id="chat-box" className="bg-white ms-3 position-relative">
            <div className="chat-box-header">
              <div className="d-flex align-items-center p-3">
                <img src={chatList[0].img} alt="" className="avatar" />
                <div className="ms-2">
                  <p className="mb-0 name">{chatList[0].name}</p>
                  <p className="mb-0 text">Online</p>
                </div>
              </div>
            </div>
            <div className="chat-box-body">
              {chatContent.map((item) => (
                <div
                  style={{ marginTop: "22px" }}
                  className={`chat-content ${
                    item.id === 0 ? "d-flex justify-content-end" : ""
                  }`}
                >
                  <div>
                    <div
                      className="d-flex align-items-center p-3"
                      style={{ width: "500px" }}
                    >
                      {item.id === 0 ? (
                        ""
                      ) : (
                        <img src={item.img} alt="" className="avatar" />
                      )}
                      <div className="ms-2 w-100">
                        <div className="d-flex justify-content-between">
                          <p className="mb-0 name">{item.name}</p>
                          <p className="mb-0 text">{item.time}</p>
                        </div>
                        <p
                          className={`mb ${
                            item.id === 0 ? "self-content" : "content"
                          }`}
                        >
                          {item.content}
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
                  <FaLink className="mx-3"/>
                  <LuSmile className="mx-3"/>
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
