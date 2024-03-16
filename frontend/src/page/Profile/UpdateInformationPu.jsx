import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import "../../components/report-popup/popup.scss";
import { FiEdit } from "react-icons/fi";
function UpdateInformationPu() {
  const [show, setShow] = useState(false);
  const modalClose = () => setShow(false);
  const modalShow = () => setShow(true);

  //   const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (event) => {};

  const modelSubmit = (event) => {
    event.preventDefault();

    modalClose();
  };

  return (
    <div className="p-1">
      <FiEdit onClick={modalShow} id="btn-update-project" />

      <Modal show={show} onHide={modalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Report Content</Modal.Title>
        </Modal.Header>

        <Modal.Body className="popup-body report-popup" id="report-body">
          <label className="form-label">Full Name:</label>
          <input
            type="text"
            className="form-control"
            name="fullName"
            // value={inputs.fullName}

            onChange={handleChange}
            aria-label="Full name"
          />

          <label className="form-label">
            {1 === "1" ? "Establish date" : "Birthday"}
            {/* {inputs.role === "Business" ? "Establish date" : "Birthday"} */}
          </label>
          <input
            type="date"
            name="date"
            // value={inputs.date}
            onChange={handleChange}
            className="form-control"
            aria-label="Birthday"
          />

          <label className="form-label">Phone number</label>
          <input
            type="text"
            name="phoneNumber"
            // value={inputs.phoneNumber}
            onChange={handleChange}
            className="form-control"
            aria-label="Phone number"
          />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={modalClose}>
            Close
          </Button>
          <Button variant="warning" onClick={modelSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default UpdateInformationPu;
