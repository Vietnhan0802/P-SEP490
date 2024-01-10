import React from "react";
import Header from "../../components/header";
import { Col, Container, Row } from "react-bootstrap";
import SideBar from "../../components/SideBar";
import "../Homepage/homepage.scss"
import Follow from "../../components/follow";
import Post from "../Post/post";
import Cookies from 'js-cookie';
function Homepage() {
  // console.log(Cookies.get('user'));
  const user = JSON.parse(Cookies.get('user'));
  console.log(user.Email);
  return (
    <div>
      <Container className="bg">
        <Header />
        <Row className="mt-3">
          <Col md={3}><SideBar/></Col>
          <Col md={6}><Post/></Col>
          <Col md={3}><Follow/></Col>
        </Row>
      </Container>
    </div>
  );
}

export default Homepage;
