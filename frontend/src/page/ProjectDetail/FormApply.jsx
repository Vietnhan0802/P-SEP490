import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import "./form-member.scss";
import { IoPersonAdd } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import Avatar from "../../images/common/post-img-3.png";
import { BsSendPlus } from "react-icons/bs";
function FormApply() {
  const [show, setShow] = useState(false);

  const modalClose = () => setShow(false);
  const modalShow = () => setShow(true);
  return (
    <div className="p-1">
      <Button variant="" onClick={modalShow}>
        <div className="d-flex align-items-center add-member">
          <BsSendPlus className="pe-2 fs-3" />
          <p>Send Apply</p>
        </div>
      </Button>
      <Modal show={show} onHide={modalClose}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>

        <Modal.Body className="popup-body" id="member-apply">
          <div className="confirmation-box">
            <h2>Are you sure you want to apply for this project?</h2>
            <p>(Upload your CV to Continue )</p>
            <input
              type="file"
              className="form-control"
              accept=".pdf,.doc,.docx"
              required
            />
            <br/>
            <button onclick="confirmApplication()">Confirm</button>
          </div>
        </Modal.Body>
        {/* 
        <Modal.Footer>
          <Button variant="secondary" onClick={modalClose}>
            Close
          </Button>
        </Modal.Footer> */}
      </Modal>
    </div>
  );
}
export default FormApply;
