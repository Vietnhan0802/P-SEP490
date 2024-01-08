import React from "react";
import Header from "../../components/header";
import { Col, Container, Row } from "react-bootstrap";
import SideBar from "../../components/SideBar";
function Homepage() {
  return (
    <div>
      <Container>
        <Header />
        <Row className="mt-3">
          <Col><SideBar/></Col>
          <Col></Col>
          <Col></Col>
        </Row>
      </Container>
    </div>
  );
}

export default Homepage;
