import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../../components/header";
import ChatNav from "../Chat/chatSearch";
import "../Chat/chat.scss";
function Chat() {
  return (
    <>
        <Header />
        <Row className="">
          <Col md={3} className="">

          </Col>
          <Col md={9} className="">
            chat
          </Col>
        </Row>
    </>
  );
}

export default Chat;
