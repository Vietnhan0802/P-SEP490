import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { projectInstance } from "../../axios/axiosConfig";

function RejectConfirm({ id, reset, role }) {
  const idMember = id;
  const [show, setShow] = useState(false);
  const modalClose = () => setShow(false);
  const modalShow = () => setShow(true);
  const handleConfirm = () => {
    if (role === 'Member') {
      projectInstance.put(`DenyProjectInvitation/${idMember}`)
        .then((res) => {
          setShow(false);
          reset('Success');
        })
        .catch((error) => { })
    } else {
      projectInstance.put(`DenyProjectApplication/${idMember}`)
        .then((res) => {
          setShow(false);
          reset('Success');
        })
        .catch((error) => { })
    }

  }
  return (
    <div className="p-1">
      <Button variant="danger" onClick={modalShow}>
        Deny
      </Button>
      <Modal show={show} onHide={modalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation Box</Modal.Title>
        </Modal.Header>

        <Modal.Body className="popup-body" id="">
          Confirming this REJECTION will deny the individual access to the project and to other related information within the project. <br />Are you sure you want to proceed with the rejection?
        </Modal.Body>

        <Modal.Footer>
          <Button variant="warning" onClick={handleConfirm}>
            Confirm
          </Button>
          <Button variant="secondary" onClick={modalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default RejectConfirm;
