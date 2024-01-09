import React from "react";
import Header from "../../components/header";
import { Col, Container, Row } from "react-bootstrap";
import SideBar from "../../components/SideBar";
import "../Homepage/homepage.scss"
function Homepage() {
  return (
    <div>
      <Container className="bg">
        <Header />
        <Row className="mt-3">
          <Col md={3}><SideBar/></Col>
          <Col md={6}></Col>
          <Col md={3}></Col>
        </Row>
      </Container>
    </div>
  );
}

export default Homepage;
