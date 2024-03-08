import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import "./form-member.scss";
import { IoPersonAdd } from "react-icons/io5";
function FormMember() {
  const [show, setShow] = useState(false);

  const modalClose = () => setShow(false);
  const modalShow = () => setShow(true);
  const modelSubmit = () => setShow(false);
  return (
    <div className="p-1">
      <Button variant="" onClick={modalShow}>
        <div className="d-flex align-items-center add-member">
          <IoPersonAdd className="pe-2 fs-3" />
          <p>Add member</p>
        </div>
      </Button>
      <Modal show={show} onHide={modalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Select Date</Modal.Title>
        </Modal.Header>

        <Modal.Body className="popup-body">
          <div className="start mb-3">
            <input type="date" className="form-control" />
          </div>
          <div className="end">
            <input type="date" className="form-control" />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={modalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={modelSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default FormMember;
