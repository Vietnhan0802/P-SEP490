import React, { useEffect, useRef, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { IoSearchSharp } from "react-icons/io5";
import { LuSendHorizonal } from "react-icons/lu";
import defaultImage from "../../images/common/default.png";
import "../Chat/chat.scss";
import { FaRegFolder } from "react-icons/fa";
import { FaRegImage } from "react-icons/fa6";
import { LuSmile } from "react-icons/lu";
import { chatInstance } from "../../axios/axiosConfig";
import * as signalR from "@microsoft/signalr";
import { useLocation } from "react-router-dom";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { FaRegFileAlt } from "react-icons/fa";
import { Button, Dropdown } from "react-bootstrap";
import { MdDelete } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import DeleteChat from "./DeleteChat";
function Chat() {
  const sessionData = JSON.parse(sessionStorage.getItem("userSession")) || {};
  const { currentUserId } = sessionData;
  const location = useLocation();
  const { userId } = location.state || {};
  const [conversations, setConversations] = useState([]);
  const [filterConversations, setFilterConversations] = useState([]);
  const [messages, setMessages] = useState();
  const [message, setMessage] = useState("");
  const [activeUser, setActiveUser] = useState(null);
  const [reset, setReset] = useState(false);
  const [connection, setConnection] = useState(null);
  // const [connectionId, setConnectionId] = useState(null);
  // const [connectUserId, setConnectUserId] = useState(null);
  const [showEmojiBox, setShowEmojiBox] = useState(false);
  const [search, setSearch] = useState("");
  const [showDeleteChat, setShowDeleteChat] = useState(false);
  const [idConversationDelete, setIdConversationDelete] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    if (event.target.value === "") {
      // corrected condition
      const originalUsers =
        JSON.parse(sessionStorage.getItem("originalUserList")) || [];
      // console.log(originalUsers)
      setFilterConversations(originalUsers);
    } else {
      setFilterConversations(
        conversations.filter((conversation) =>
          conversation.fullName
            .toLowerCase()
            .includes(event.target.value.toLowerCase())
        )
      );
    }
  }

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(`https://localhost:7001/chatHub?userId=${currentUserId}`) // Replace with your server URL
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    console.log(newConnection);

    newConnection.on("ReceiveMessage", (connectId, messageText) => {
      console.log(connectId);
      console.log(newConnection.connectionId);
      chatInstance.get(`GetConversationsByUser/${currentUserId}`)
      .then((res) => {
        setConversations(res?.data?.result);
        console.log("TH1: userId === undefined");
        console.log(res.data.result[0].idAccount1);
        console.log(res.data.result[0].idAccount2);
        console.log("currentUserId: " + currentUserId);
        console.log("receiveId: " + currentUserId === res.data.result[0].idAccount1 ? res.data.result[0].idAccount1 : res.data.result[0].idAccount2);
        console.log("---------------------------------------------")
        console.log(res.data.result[0].idAccount1 === messageText.idReceiver);
        console.log(res.data.result[0].idAccount1 === messageText.idSender);
        console.log(res.data.result[0].idAccount2 === messageText.idReceiver);
        console.log(res.data.result[0].idAccount2 === messageText.idSender);
        if ((res.data.result[0].idAccount1 === messageText.idReceiver || res.data.result[0].idAccount1 === messageText.idSender)
          &&(res.data.result[0].idAccount2 === messageText.idReceiver || res.data.result[0].idAccount2 === messageText.idSender)) {
            setMessages((prevMessages) => {
              if (Array.isArray(prevMessages)) {
                return [...prevMessages, messageText];
              } else {
                return [messageText];
              }
            });
            console.log("ReceiveMessage-------------------");
            console.log(messageText);
        }
        // if (currentUserId === messageText.idReceiver && messageText.idSender === res.data.result[0].idAccount1 ? res.data.result[0].idAccount2 : res.data.result[0].idAccount1){
        //   console.log(currentUserId);
        //   console.log(messageText.idReceiver);
        //   console.log(messageText.idSender);
        //   console.log(res.data.result[0].idAccount1 ? res.data.result[0].idAccount2 : res.data.result[0].idAccount1);
        //   setMessages((prevMessages) => {
        //     if (Array.isArray(prevMessages)) {
        //       return [...prevMessages, messageText];
        //     } else {
        //       return [messageText];
        //     }
        //   });
        //   console.log("ReceiveMessage-------------------");
        //   console.log(messageText);
        // }
      })
      .catch((error) => {
        console.error(error);
      });
    });

    newConnection.on("RecallMessage", (messageText) => {
      setMessages((prevMessages) =>
        prevMessages.map((message) => {
          if (message.idMessage === messageText.idMessage) {
            return { ...message, isRecall: true };
          }
          return message;
        })
      );
      console.log("RecallMessage-------------------");
      console.log(messageText);
    });

    newConnection
      .start()
      .then(() => {
        console.log("Connected to SignalR hub");
      })
      .catch((error) =>
        console.log("Error connecting to SignalR hub: ", error)
      );

    return () => {
      // Đóng kết nối khi component bị unmount
      newConnection.stop();
    };
  }, [currentUserId]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  }

  useEffect(() => {
    chatInstance
      .get(`GetConversationsByUser/${currentUserId}`)
      .then((res) => {
        setConversations(res?.data?.result);
        const initialConversation =
          userId === undefined
            ? res.data.result[0]
            : res.data.result.find(
                (conv) =>
                  (currentUserId === conv.idAccount1 &&
                    userId === conv.idAccount2) ||
                  (currentUserId === conv.idAccount2 &&
                    userId === conv.idAccount1)
              );

        if (initialConversation) {
          const receiverId =
            currentUserId === initialConversation.idAccount1
              ? initialConversation.idAccount2
              : initialConversation.idAccount1;

          chatInstance
            .get(`GetMessages/${currentUserId}/${receiverId}`)
            .then((res) => {
              setMessages(res.data.result);
              setActiveUser({
                avatar: res?.data?.result[0].avatarReceiver,
                name: res?.data?.result[0].nameReceiver,
                receiverId:
                  res?.data?.result[0].idReceiver === currentUserId
                    ? res?.data?.result[0].idSender
                    : res?.data?.result[0].idReceiver,
              });
              if (connection) {
                try {
                  connection.invoke(
                    "AddToGroup",
                    connection.connectionId,
                    res?.data?.result[0].idConversation
                  );
                  console.log(
                    "Join group: " + res?.data?.result[0].idConversation
                  );
                } catch (error) {
                  console.error("Error sending message: ", error);
                }
              }
            })
            .catch((error) => {
              console.error(error);
            });
        }
        // if (userId === undefined) {
        //   console.log("TH1: userId === undefined");
        //   console.log("currentUserId: " + currentUserId);
        //   console.log(
        //     "receiveId: " + currentUserId === res.data.result[0].idAccount1
        //       ? res.data.result[0].idAccount2
        //       : res.data.result[0].idAccount1
        //   );
        //   chatInstance
        //     .get(
        //       `GetMessages/${currentUserId}/${
        //         currentUserId === res.data.result[0].idAccount1
        //           ? res.data.result[0].idAccount2
        //           : res.data.result[0].idAccount1
        //       }`
        //     )
        //     .then((res) => {
        //       setMessages(res.data.result);
        //       setActiveUser({
        //         avatar: res?.data?.result[0].avatarReceiver,
        //         name: res?.data?.result[0].nameReceiver,
        //         receiverId:
        //           res?.data?.result[0].idReceiver === currentUserId
        //             ? res?.data?.result[0].idSender
        //             : res?.data?.result[0].idReceiver,
        //       });
        //       if (connection) {
        //         try {
        //           connection.invoke(
        //             "AddToGroup",
        //             connection.connectionId,
        //             res?.data?.result[0].idConversation
        //           );
        //           console.log(
        //             "Join group: " + res?.data?.result[0].idConversation
        //           );
        //         } catch (error) {
        //           console.error("Error sending message: ", error);
        //         }
        //       }
        //     })
        //     .catch((error) => {
        //       console.error(error);
        //     });
        // }
        // if (userId !== undefined) {
        //   console.log("TH2: userId !== undefined");
        //   console.log("currentUserId: " + currentUserId);
        //   console.log("userId: " + userId);
        //   chatInstance
        //     .get(`GetMessages/${currentUserId}/${userId}`)
        //     .then((res) => {
        //       setMessages(res.data.result);
        //       if (connection) {
        //         try {
        //           connection.invoke(
        //             "AddToGroup",
        //             connection.connectionId,
        //             res?.data?.result[0].idConversation
        //           );
        //           console.log(
        //             "Join group: " + res?.data?.result[0].idConversation
        //           );
        //         } catch (error) {
        //           console.error("Error sending message: ", error);
        //         }
        //       }
        //     })
        //     .catch((error) => {
        //       console.error(error);
        //     });
        // }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [currentUserId, reset, userId, connection]);

  useEffect(() => {
    if (selectedUserId !== null) {
      console.log("TH2: selectedUserId !== null");
      console.log("currentUserId: " + currentUserId);
      console.log("selectedUserId: " + selectedUserId);
      chatInstance
        .get(`GetMessages/${currentUserId}/${selectedUserId}`)
        .then((res) => {
          if (
            Array.isArray(res?.data?.result) &&
            res?.data?.result.length !== 0
          ) {
            setMessages(res.data.result);
            setActiveUser({
              avatar: res?.data?.result[0].avatarReceiver,
              name: res?.data?.result[0].nameReceiver,
              receiverId: selectedUserId,
            });
            if (connection) {
              try {
                connection.invoke(
                  "AddToGroup",
                  connection.connectionId,
                  res?.data?.result[0].idConversation
                );
                console.log(
                  "Join group: " + res?.data?.result[0].idConversation
                );
              } catch (error) {
                console.error("Error sending message: ", error);
              }
            }
          } else {
            setMessages([]);
            setActiveUser(null);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [currentUserId, selectedUserId]);

  const handleConversation = (idAccount2) => {
    setSelectedUserId(idAccount2);
  };
  const handleInputMessage = (event) => {
    setMessage(event.target.value);
  };
  const handleSetEmoji = (e) => {
    setMessage((mes) => mes + e);
  };

  const handleSendMessage = () => {
    const formData = new FormData();
    formData.append("content", message);
    if (userId !== undefined) {
      // console.log("TH1: userId !== undefined");
      // console.log("currentUserId: " + currentUserId);
      // console.log("userId: " + userId);
      chatInstance
        .post(`SendMessage/${currentUserId}/${userId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            accept: "application/json",
          },
        })
        .then((res) => {
          setReset(!reset);
          setMessage("");
          if (connection && message) {
            try {
              connection.invoke('SendMessageToClient', res?.data?.result.idReceiver, res?.data?.result);
              console.log('receiveID: ' + res?.data?.result.idReceiver);
              console.log(res?.data?.result);
              // connection.invoke('SendMessageToGroup', res?.data?.result.idConversation, currentUserId, res?.data?.result);
              // console.log('Invoke userId: ' + res?.data?.result.idConversation);
              // console.log(res?.data?.result);

              // connection.invoke('AddToGroup', res?.data?.result.idSender, res?.data?.result.idConversation);
              // console.log('Invoke userId: ' + res?.data?.result.idConversation);
              // console.log(res?.data?.result);
              // connection.invoke('AddToGroup', res?.data?.result.idReceiver, res?.data?.result.idConversation);
            } catch (error) {
              console.error("Error sending message: ", error);
            }
          }
        })
        .catch((error) => console.error(error));
    } else {
      console.log("TH2: ");
      console.log("currentUserId: " + currentUserId);
      console.log("activeUser: " + activeUser.receiverId);
      chatInstance
        .post(
          `SendMessage/${currentUserId}/${activeUser.receiverId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              accept: "application/json",
            },
          }
        )
        .then((res) => {
          setReset(!reset);
          setMessage("");
          if (connection && message) {
            try {
              connection.invoke('SendMessageToClient', res?.data?.result.idReceiver, res?.data?.result);
              console.log('receiveID: ' + res?.data?.result.idReceiver);
              console.log(res?.data?.result);
              // connection.invoke('SendMessageToGroup', res?.data?.result.idConversation, currentUserId, res?.data?.result);
              // console.log('Invoke room: ' + res?.data?.result.idConversation);
              // console.log(res?.data?.result);

              //connection.invoke('AddToGroup', res?.data?.result.idSender, res?.data?.result.idConversation);
              //connection.invoke('AddToGroup', res?.data?.result.idReceiver, res?.data?.result.idConversation);
            } catch (error) {
              console.error("Error sending message: ", error);
            }
          }
        })
        .catch((error) => console.error(error));
    }
  };
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("FileFile", file);
      // Send the file to the server using an HTTP POST request
      chatInstance
        .post(
          `SendMessage/${currentUserId}/${activeUser.receiverId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          setReset(!reset);
          setMessage("");
          if (connection && file) {
            try {
              connection.invoke(
                "SendMessageToGroup",
                res?.data?.result.idConversation,
                res?.data?.result
              );
              console.log("Invoke userId: " + res?.data?.result.idConversation);
              console.log(res?.data?.result);
            } catch (error) {
              console.error("Error sending message: ", error);
            }
          }
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    }
  };
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("ImageFile", file);
      // Send the file to the server using an HTTP POST request
      chatInstance
        .post(
          `SendMessage/${currentUserId}/${activeUser.receiverId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          setReset(!reset);
          setMessage("");
          if (connection && file) {
            try {
              connection.invoke(
                "SendMessageToGroup",
                res?.data?.result.idConversation,
                res?.data?.result
              );
              console.log("Invoke userId: " + res?.data?.result.idConversation);
              console.log(res?.data?.result);
            } catch (error) {
              console.error("Error sending message: ", error);
            }
          }
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    }
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays < 7) {
      // Nếu thời gian nhỏ hơn 7 ngày so với hiện tại, hiển thị thứ
      const daysOfWeek = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const dayOfWeek = daysOfWeek[date.getDay()];
      const time = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${dayOfWeek}, ${time}`;
    } else {
      // Ngược lại, hiển thị ngày
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      const time = date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      return `${day}/${month}/${year}, ${time}`;
    }
  };
  const chatBoxBodyRef = useRef(null);
  useEffect(() => {
    if (chatBoxBodyRef.current) {
      chatBoxBodyRef.current.scrollTop = chatBoxBodyRef.current.scrollHeight;
    }
  }, [messages]);
  const handleSetShowDeleteChat = (idConversation) => {
    setShowDeleteChat(true);
    setIdConversationDelete(idConversation);
  };
  const resetConversation = () => {
    reset(!reset);
  };
  const handleDeleteMess = (id) => {
    chatInstance
      .delete(`DeleteMessage/${id}/${currentUserId}`)
      .then((res) => {
        console.log(res?.data?.result);
        setReset(!reset);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const handleRecallMess = (id) => {
    chatInstance
      .delete(`RecallMessage/${id}/${currentUserId}`)
      .then((res) => {
        console.log(res?.data?.result);
        setReset(!reset);
        if (connection) {
          try {
            connection.invoke(
              "RecallMessage",
              res?.data?.result.idConversation,
              res?.data?.result
            );
            console.log("Invoke userId: " + res?.data?.result.idConversation);
            console.log(res?.data?.result);
          } catch (error) {
            console.error("Error sending message: ", error);
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <Row
      className="m-3"
      style={{ height: "calc(100vh - 97px)", paddingBottom: "16px" }}
    >
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
            <div
              className={`position-absolute w-100 form-control overflow-hidden ${
                search === "" ? "hidden-box" : ""
              }`}
              style={{
                textOverflow: "ellipsis",
                top: " 41px",
                left: "0px",
              }}
            >
              {filterConversations.length > 0 ? (
                filterConversations.map((user) => (
                  <div
                    key={user.id}
                    className="d-flex align-items-center my-2"
                    onClick={() =>
                      handleConversation(
                        currentUserId === user?.idAccount1
                          ? user?.idAccount2
                          : user?.idAccount1
                      )
                    }
                  >
                    <div className="position-relative">
                      <img
                        src={user.avatar}
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                        }}
                        alt=""
                      />
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
                <div
                  className="chat-item"
                  key={item?.idConversation}
                  onClick={() =>
                    handleConversation(
                      currentUserId === item?.idAccount1
                        ? item?.idAccount2
                        : item?.idAccount1
                    )
                  }
                >
                  <div className="d-flex align-items-center position-relative">
                    <Dropdown className="position-absolute top-0 end-0">
                      <Dropdown.Toggle
                        variant="white"
                        className="border-none text-body"
                      >
                        <BsThreeDots size={14} />
                      </Dropdown.Toggle>

                      <Dropdown.Menu style={{ minWidth: "auto" }}>
                        <Dropdown.Item>
                          <MdDelete
                            size={14}
                            onClick={() =>
                              handleSetShowDeleteChat(item?.idConversation)
                            }
                          />
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    <img
                      src={
                        item?.avatar === "https://localhost:7006/Images/"
                          ? defaultImage
                          : item?.avatar
                      }
                      alt=""
                      className="avatar"
                    />
                    <div className="ms-2">
                      <p className="mb-0 name">{item?.fullName}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No conversations found.</p>
            )}
            {showDeleteChat && (
              <DeleteChat
                show={showDeleteChat}
                onClose={() => setShowDeleteChat(false)}
                currentUserId={currentUserId}
                idConversation={idConversationDelete}
                resetConversation={resetConversation}
              />
            )}
          </div>
        </div>
      </Col>
      <Col md={10} className="pe-0">
        <div id="chat-box" className="bg-white ms-3 position-relative">
          <div className="chat-box-header">
            <div className="d-flex align-items-center p-3">
              {messages?.idConversation ===
              "00000000-0000-0000-0000-000000000000" ? (
                <>
                  <img
                    src={messages?.avatarReceiver}
                    alt=""
                    className="avatar"
                  />
                  <div className="ms-2">
                    <p className="mb-0 name">{messages?.nameReceiver || ""}</p>
                    <p className="mb-0 text">Online</p>
                  </div>
                </>
              ) : activeUser !== null ? (
                <>
                  <img src={activeUser.avatar} alt="" className="avatar" />
                  <div className="ms-2">
                    <p className="mb-0 name">{activeUser.name || ""}</p>
                    <p className="mb-0 text">Online</p>
                  </div>
                </>
              ) : (
                <>
                  {Array.isArray(conversations) && conversations.length > 0 ? (
                    <div className="d-flex">
                      <img
                        src={conversations[0]?.avatar}
                        alt=""
                        className="avatar"
                      />
                      <div className="ms-2">
                        <p className="mb-0 name">
                          {conversations[0]?.fullName || ""}
                        </p>
                        <p className="mb-0 text">Online</p>
                      </div>
                    </div>
                  ) : (
                    <img src={defaultImage} alt="" className="avatar" />
                  )}
                </>
              )}
            </div>
          </div>
          <div className="chat-box-body" ref={chatBoxBodyRef}>
            {Array.isArray(messages) && messages?.length > 0
              ? messages?.map((item) => (
                  <div
                    key={item?.idMessage}
                    style={{ marginTop: "22px" }}
                    className={`chat-content ${
                      item?.isYourself ? "d-flex justify-content-end" : ""
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
                          <img
                            src={
                              item.idSender !== currentUserId
                                ? item.avatarReceiver
                                : item?.avatarSender
                            }
                            alt=""
                            className="avatar"
                          />
                        )}
                        <div className="ms-2 w-100">
                          <div className="d-flex justify-content-between">
                            <p className="mb-0 name">
                              {item?.isYourself
                                ? item?.nameSender
                                : item?.nameReceiver}
                            </p>
                            <p className="mb-0 text">
                              {formatDate(item?.createdDate)}
                            </p>
                          </div>
                          {item?.content && (
                            <div className="position-relative">
                              {item?.isRecall && (
                                <div className="w-100 h-100 position-absolute d-flex align-items-center bg-blur">
                                  <p className="ms-3 white">
                                    Message is unsend
                                  </p>
                                </div>
                              )}

                              <p
                                className={`mb ${
                                  item?.isYourself ? "self-content" : "content"
                                }`}
                              >
                                {item?.content}
                              </p>
                              <Dropdown
                                className={`position-absolute ${
                                  item?.isYourself ? "option-other" : "option"
                                } `}
                              >
                                <Dropdown.Toggle
                                  variant="white"
                                  className="border-none text-body"
                                >
                                  <BsThreeDots size={14} />
                                </Dropdown.Toggle>
                                <Dropdown.Menu style={{ minWidth: "auto" }}>
                                  <Dropdown.Item
                                    onClick={() =>
                                      handleDeleteMess(item.idMessage)
                                    }
                                  >
                                    <p style={{ fontSize: "14px" }}>Delete</p>
                                  </Dropdown.Item>
                                  {item?.isYourself ? (
                                    <Dropdown.Item
                                      onClick={() =>
                                        handleRecallMess(item.idMessage)
                                      }
                                    >
                                      <p style={{ fontSize: "14px" }}>Unsend</p>
                                    </Dropdown.Item>
                                  ) : (
                                    ""
                                  )}
                                </Dropdown.Menu>
                              </Dropdown>
                            </div>
                          )}

                          {item?.file && (
                            <a
                              className="text-white"
                              href={` https://localhost:7001/Images/${item?.file}`} // Directly use the cvFile URL here
                              target="_blank" // Ensure it opens in a new tab
                              rel="noopener noreferrer" // Improve security for opening new tabs
                              download
                            >
                              <div
                                className={`mb ${
                                  item?.isYourself ? "self-content" : "content"
                                }`}
                              >
                                <FaRegFileAlt /> {item?.file}
                              </div>
                            </a>
                          )}
                          {item?.image && (
                            <img
                              src={`https://localhost:7001/Images/${item?.image}`} // Directly use the cvFile URL here
                              alt="text_image"
                              className="text-white"
                              style={{ borderRadius: "8px", maxWidth: "460px" }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              : ""}
          </div>
          <div className="chat-box-input position-absolute bottom-0 w-100">
            <div className="w-100 d-flex justify-content-center icon-chat">
              <div className="w-auto fw-bold fs-3 icon-item d-flex align-items-center">
                <label htmlFor="file-input" className="mx-3">
                  <FaRegFolder />
                </label>
                <input
                  id="file-input"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                />
                <label htmlFor="image-input">
                  <FaRegImage className="mx-3" />
                </label>
                <input
                  id="image-input"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />
                <div className="mx-3 w-auto">
                  <div className="position-relative">
                    <div className="position-absolute bottom-0 start-0">
                      {showEmojiBox && (
                        <Picker
                          data={data}
                          onEmojiSelect={(e) => handleSetEmoji(e.native)}
                          emojiButtonSize={28}
                          emojiSize={20}
                        />
                      )}
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
                disabled={message === ""}
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
