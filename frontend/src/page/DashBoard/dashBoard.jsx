import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Header from "../../components/header";
import SideBar from "../../components/SideBar";
import AccessManage from "./accessManage";
import BlogManage from "./blogManage";
import PostManage from "./postManage";
import ReportManage from "./reportManage";
import VerifyManage from "./verifyManage";
import AccessTable from "./accessTable";
import "./dashBoard.scss";

function DashBoard() {
  return (
    <Container>
      <Header />
      <Row>
        <Col md={3}>
          <SideBar />
        </Col>
        <Col md={9}>
          <Row>
            <Col md={9} className="optionArea">
              <Row>
                <Col md={6}>
                  <PostManage />
                </Col>
                <Col md={6}>
                  <BlogManage />
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <AccessManage />
                </Col>
                <Col md={6}>
                  <ReportManage />
                </Col>
              </Row>
            </Col>
            <Col md={3}>
              <VerifyManage />
            </Col>
          </Row>
          <Row className="dbContent">
            <AccessTable/>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
export default DashBoard;
