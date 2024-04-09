import React, { useEffect, useRef, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { IoSearchSharp } from "react-icons/io5";
import { LuSendHorizonal } from "react-icons/lu";
import defaultImage from "../../images/common/default.png";
import "../Chat/chat.scss";
import { FaRegFolder } from "react-icons/fa";
import { FaRegImage } from "react-icons/fa6";
import { FaLink } from "react-icons/fa6";
import { LuSmile } from "react-icons/lu";
import { chatInstance } from "../../axios/axiosConfig";
import * as signalR from "@microsoft/signalr";
import { useLocation } from "react-router-dom";
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { FaRegFileAlt } from "react-icons/fa";
function Chat() {

  const sessionData = JSON.parse(sessionStorage.getItem("userSession")) || {};
  const { currentUserId } = sessionData;
  const location = useLocation();
  const { userId } = location.state || {};
  const [conversations, setConversations] = useState([]);
  const [filterConversations, setFilterConversations] = useState([]);
  const [messages, setMessages] = useState();
  const [message, setMessage] = useState('');
  const [activeUser, setActiveUser] = useState(null);
  const [reset, setReset] = useState(false);
  const [connection, setConnection] = useState(null);
  const [usersOnl, setUsersOnl] = useState([]);
  const [showEmojiBox, setShowEmojiBox] = useState(false);
  const [search, setSearch] = useState('');
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    if (event.target.value === '') { // corrected condition
      const originalUsers = JSON.parse(sessionStorage.getItem('originalUserList')) || [];
      // console.log(originalUsers)
      setFilterConversations(originalUsers);
    } else {
      setFilterConversations(conversations.filter(
        conversation => conversation.fullName.toLowerCase().includes(event.target.value.toLowerCase())
      ));
    }
  }

  const joinConversation = async (currentUserId, idConversation) => {
    try {
      const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7001/chatHub") // Replace with your server URL
      .withAutomaticReconnect()
      .build();
      
      connection.on("ReceiveMessage", (messageText) => {
        //setMessages(messages => [...messages, { currentUserId, message }])
        setMessages((prevMessages) => {
          if (Array.isArray(prevMessages)) {
            return [...prevMessages, messageText];
          } else {
            return [messageText];
          }
        });
        console.log("Message received: ", messageText);
      });

      await connection.start();
      await connection.invoke("JoinConversation", {currentUserId, idConversation});
      setConnection(connection);
    } catch (e) {
      console.log(e);
    }
  }

  const sendMessage = async (message) => {
    try {
      await connection.invoke("SendMessage", message);
    } catch (e) {
      console.log(e);
    }
  }

  // useEffect(() => {
  //   const newConnection = new signalR.HubConnectionBuilder()
  //     .withUrl("https://localhost:7001/chatHub") // Replace with your server URL
  //     .withAutomaticReconnect()
  //     .build();
  //   setConnection(newConnection);
  // }, []);

  // useEffect(() => {
  //   if (connection) {
  //     connection.start()
  //       .then(() => {
  //         console.log('Connected to SignalR hub');
  //       })
  //       .catch(error => console.log('Error connecting to SignalR hub: ', error));
  //     connection.on("UserConnected", (currentUserId) => {
  //       setUsersOnl((usersOnl) => [...usersOnl, currentUserId]);
  //     })

  //     connection.on('ReceiveMessage', (messageText) => {
  //       //setMessages((message) => [...message, { idReceiver, message: messageText }])
  //       setMessages((prevMessages) => {
  //         if (Array.isArray(prevMessages)) {
  //           return [...prevMessages, messageText];
  //         } else {
  //           return [messageText];
  //         }
  //       });
  //       // console.log('ReceiveMessage currentUserId:' + currentUserId);
  //       // console.log('ReceiveMessage userId:' + idReceiver);
  //       console.log("ReceiveMessage here!");
  //       console.log(messageText);
  //     });
  //   }
  // }, [connection]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  }
  useEffect(() => {
    chatInstance.get(`GetConversationsByUser/${currentUserId}`)
      .then((res) => {
        setConversations(res.data.result);
        if (userId === undefined) {
          chatInstance.get(`GetMessages/${currentUserId}/${currentUserId === res.data.result[0].idAccount1 ? res.data.result[0].idAccount2 : res.data.result[0].idAccount1}`)
            .then((res) => {
              setMessages(res.data.result);
              setActiveUser({
                avatar: res?.data?.result[0].avatarReceiver,
                name: res?.data?.result[0].nameReceiver,
                receiverId: res?.data?.result[0].idReceiver === currentUserId ? res?.data?.result[0].idSender : res?.data?.result[0].idReceiver
              });
              joinConversation(currentUserId, res?.data?.result[0].idConversation);
            })
            .catch((error) => {
              console.error(error);
            });
        }
        if (userId !== undefined) {
          chatInstance.get(`GetMessages/${currentUserId}/${userId}`)
            .then((res) => {
              setMessages(res.data.result);
              joinConversation(currentUserId, res?.data?.result[0].idConversation);
            })
            .catch((error) => {
              console.error(error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [currentUserId, reset, userId]);

  const handleConversation = (idAccount2) => {
    chatInstance.get(`GetMessages/${currentUserId}/${idAccount2}`)
      .then((res) => {
        if (Array.isArray(res?.data?.result) && res?.data?.result.length !== 0) {
          setMessages(res.data.result);
          setActiveUser({
            avatar: res?.data?.result[0].avatarReceiver,
            name: res?.data?.result[0].nameReceiver,
            receiverId: res?.data?.result[0].idReceiver === currentUserId ? res?.data?.result[0].idSender : res?.data?.result[0].idReceiver
          });
          joinConversation(currentUserId, res?.data?.result[0].idConversation);
        } else {
          setMessages([]);
        }
      })
      .catch((error) => {
        console.error(error);
      })
  };
  const handleInputMessage = (event) => {
    setMessage(event.target.value);
  }
  const handleSetEmoji = (e) => {
    setMessage(mes => mes + e);
  }

  const handleSendMessage = () => {
    const formData = new FormData();
    formData.append('content', message)
    if (userId !== undefined) {
      chatInstance.post(`SendMessage/${currentUserId}/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          accept: "application/json",
        },
      })
        .then((res) => {
          setReset(!reset);
          sendMessage(res?.data?.result);
          // if (connection && message) {
          //   try {
          //     connection.invoke('SendMessage', currentUserId, userId, res?.data?.result);
          //     console.log('Invoke here!');
          //     console.log(res?.data?.result);
          //     setMessage('');
          //   } catch (error) {
          //     console.error('Error sending message: ', error);
          //   }
          // }
        })
        .catch((error) => console.error(error));
    }
    else {
      chatInstance.post(`SendMessage/${currentUserId}/${activeUser.receiverId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          accept: "application/json",
        },
      })
        .then((res) => {
          setReset(!reset);
          sendMessage(res?.data?.result);
          // if (connection && message) {
          //   try {
          //     connection.invoke('SendMessage', currentUserId, userId, res?.data?.result);
          //     setMessage('');
          //     console.log('Invoke here!');
          //     console.log(res?.data?.result);
          //   } catch (error) {
          //     console.error('Error sending message: ', error);
          //   }
          // }
        })
        .catch((error) => console.error(error));
    }
  }
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('FileFile', file);
      // Send the file to the server using an HTTP POST request
      chatInstance.post(`SendMessage/${currentUserId}/${activeUser.receiverId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then((res) => {
          sendMessage(res?.data?.result);
          // if (connection && file) {
          //   try {
          //     connection.invoke('SendMessage', currentUserId, userId, res?.data?.result);
          //     setMessage('');
          //     console.log('SendMessage currentUserId:' + currentUserId);
          //     console.log('SendMessage userId:' + userId);
          //     console.log(res?.data?.result);
          //   } catch (error) {
          //     console.error('Error sending message: ', error);
          //   }
          // }
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
        });
    }
  };
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('ImageFile', file);
      // Send the file to the server using an HTTP POST request
      chatInstance.post(`SendMessage/${currentUserId}/${activeUser.receiverId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then((res) => {
          sendMessage(res?.data?.result);
          // if (connection && file) {
          //   try {
          //     connection.invoke('SendMessage', currentUserId, userId, res?.data?.result);
          //     setMessage('');
          //     console.log('SendMessage currentUserId:' + currentUserId);
          //     console.log('SendMessage userId:' + userId);
          //     console.log(res?.data?.result);
          //   } catch (error) {
          //     console.error('Error sending message: ', error);
          //   }
          // }
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
        });
    }
  };
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
  const chatBoxBodyRef = useRef(null);
  useEffect(() => {
    if (chatBoxBodyRef.current) {
      chatBoxBodyRef.current.scrollTop = chatBoxBodyRef.current.scrollHeight;
    }
  }, [messages]);

  return (

    <Row className="m-3" style={{ height: "calc(100vh - 97px)", paddingBottom: "16px" }}>
      <Col md={2} className="bg-custom bg-white p-3 h-100">
        <div id="chat">
          <h1>Chat</h1>
          <div className="chat-search position-relative">
            <div className="d-flex align-items-center">
              <IoSearchSharp className="me-2 icon-search" />
              <input
                className="bg-search w-100"
                type="text"
                placeholder="Search"
                value={search}
                onChange={handleSearchChange}
              />

            </div>
            <div className={`position-absolute w-100 form-control overflow-hidden ${search === '' ? 'hidden-box' : ''}`} style={{
              textOverflow: 'ellipsis', 
              top: ' 41px',
              left: '0px'
            }} >
              {filterConversations.length > 0 ? (
                filterConversations.map((user) => (
                  <div key={user.id} className="d-flex align-items-center my-2" onClick={() => handleConversation(currentUserId === user?.idAccount1 ? user?.idAccount2 : user?.idAccount1)}>
                    <div className="position-relative">
                      <img src={user.avatar} style={{ width: '50px', height: '50px', borderRadius: '50%' }} alt="" />
                      {/* {user.isVerified && <img src={tick} alt="tick" className="position-absolute bottom-0 end-0" style={{ width: '18px' }} />} */}
                    </div>
                    <div className="ms-2">
                      <p>{user.fullName}</p>
                      {/* <p>{user.email}</p> */}
                    </div>
                  </div>
                ))
              ) : (
                <div>No match item</div>
              )}

            </div>
          </div>
          <div className="chat-list">
            {conversations?.length > 0 ? (
              conversations?.map((item) => (
                <div className="chat-item" key={item?.idConversation} onClick={() => handleConversation(currentUserId === item?.idAccount1 ? item?.idAccount2 : item?.idAccount1)}>
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
              {messages?.idConversation === "00000000-0000-0000-0000-000000000000" ? (
                <>
                  <img
                    src={
                      (messages?.avatarReceiver)
                    }
                    alt=""
                    className="avatar"
                  />
                  <div className="ms-2">
                    <p className="mb-0 name">{messages?.nameReceiver || ""}</p>
                    <p className="mb-0 text">Online</p>
                  </div>
                </>
              ) :
                activeUser !== null ?
                  <>
                    <img
                      src={
                        (activeUser.avatar)
                      }
                      alt=""
                      className="avatar"
                    />
                    <div className="ms-2">
                      <p className="mb-0 name">{activeUser.name || ""}</p>
                      <p className="mb-0 text">Online</p>
                    </div>
                  </> :
                  <>
                    {Array.isArray(conversations) && conversations.length > 0 ?
                      <div className="d-flex">
                        <img
                          src={
                            (conversations[0]?.avatar)
                          }
                          alt=""
                          className="avatar"
                        />
                        <div className="ms-2">
                          <p className="mb-0 name">{conversations[0]?.fullName || ""}</p>
                          <p className="mb-0 text">Online</p>
                        </div>
                      </div> : <img
                        src={
                          defaultImage}
                        alt=""
                        className="avatar"
                      />}
                  </>
              }
            </div>
          </div>
          <div className="chat-box-body" ref={chatBoxBodyRef}>
            {
              Array.isArray(messages) && messages?.length > 0 ?
                messages?.map((item) => (
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
                          <img src={item.idSender !== currentUserId ? item.avatarReceiver : item?.avatarSender} alt="" className="avatar" />
                        )}
                        <div className="ms-2 w-100">
                          <div className="d-flex justify-content-between">
                            <p className="mb-0 name">{item?.isYourself ? item?.nameSender : item?.nameReceiver}</p>
                            <p className="mb-0 text">{formatDate(item?.createdDate)}</p>
                          </div>
                          {item?.content &&
                            <p
                              className={`mb ${item?.isYourself ? "self-content" : "content"
                                }`}
                            >
                              {item?.content}
                            </p>}
                          
                          {item?.file &&
                            <a className="text-white"
                              href={` https://localhost:7001/Images/${item?.file}`} // Directly use the cvFile URL here
                              target="_blank" // Ensure it opens in a new tab
                              rel="noopener noreferrer" // Improve security for opening new tabs
                              download

                            >
                              <div
                                className={`mb ${item?.isYourself ? "self-content" : "content"
                                  }`}
                              >
                                <FaRegFileAlt /> {item?.file}
                              </div>
                            </a>}
                          {item?.image &&
                            <img
                              src={`https://localhost:7001/Images/${item?.image}`} // Directly use the cvFile URL here
                              alt="text_image"
                              className="text-white"
                              style={{ borderRadius: '8px', maxWidth: '460px' }}
                            />
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                )) : ''}
          </div>
          <div className="chat-box-input position-absolute bottom-0 w-100">
            <div className="w-100 d-flex justify-content-center icon-chat">
              <div className="w-auto fw-bold fs-3 icon-item d-flex align-items-center">
                <label htmlFor="file-input" className="mx-3" >
                  <FaRegFolder />
                </label>
                <input
                  id="file-input"
                  type="file"
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
                <label htmlFor="image-input">
                  <FaRegImage className="mx-3" />
                </label>
                <input
                  id="image-input"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
                <div className="mx-3 w-auto" >
                  <div className="position-relative">
                    <div className="position-absolute bottom-0 start-0">
                      {showEmojiBox && <Picker data={data} onEmojiSelect={(e) => handleSetEmoji(e.native)} emojiButtonSize={28} emojiSize={20} />}
                    </div>
                  </div>
                  <LuSmile onClick={() => setShowEmojiBox(!showEmojiBox)} />
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center p-3 w-100">
              <div className="cover">
                <input
                  type="text"
                  placeholder="Message"
                  className="w-100 input-chat"
                  value={message}
                  onChange={handleInputMessage}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <button
                className="btn btn-primary ms-3 d-flex align-items-center p-3"
                // style={{ height: "40px" }}
                onClick={handleSendMessage}
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
