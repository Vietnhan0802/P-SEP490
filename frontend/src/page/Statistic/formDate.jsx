import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import "./popup.scss";
function FormDate() {
  const [show, setShow] = useState(false);

  const modalClose = () => setShow(false);
  const modalShow = () => setShow(true);
  const modelSubmit = () => setShow(false);
  return (
    <div className="p-1">
      <Button variant="warning" onClick={modalShow}>
        Select Date
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
export default FormDate;
