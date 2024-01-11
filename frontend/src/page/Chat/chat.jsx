import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../../components/header";
import ChatNav from "../Chat/chatSearch";
import "../Chat/chat.scss";
function Chat() {
  return (
    <>
      <Container>
        <Header />
        <Row className="">
          <Col md={3} className="">
            <h1>Chat</h1>
            <ChatNav />
          </Col>
          <Col md={9} className="">
            chat
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Chat;
