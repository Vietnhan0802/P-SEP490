import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../scss/header.scss";
import { Row, Col,Image } from "react-bootstrap";
import logoImg from "../images/common/logo.png";
export default function Header() {
  return (    
    <Row>
      <Col>
      <Image src={logoImg} className="logo"/>
      </Col>
      <Col  className="justify-content-center d-flex ">2 of 3</Col>
      <Col>3 of 3</Col>
    </Row>
  );
}
