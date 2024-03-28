import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { projectInstance } from "../../axios/axiosConfig";

function AcceptConfirm({ id, reset, role }) {
  const idMember = id;
  const [show, setShow] = useState(false);
  const modalClose = () => setShow(false);
  const modalShow = () => setShow(true);
  const handleConfirm = () => {
    if (role === 'Business') {
      projectInstance.put(`AcceptProjectApplication/${idMember}`)
        .then((res) => {
          setShow(false);
          reset('Success');
        })
        .catch((error) => { console.error(error); })
    } else {
      projectInstance.put(`AcceptProjectInvitation/${idMember}`)
        .then((res) => {
          setShow(false);
          reset('Success');
        })
        .catch((error) => { console.error(error); })
    }
  }

  return (
    <div className="p-1">
      <Button variant="primary" onClick={modalShow}>
        Accept
      </Button>
      <Modal show={show} onHide={modalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation Box</Modal.Title>
        </Modal.Header>

        <Modal.Body className="popup-body" id="">
          Confirming this ACCEPTANCE will grant the individual access to the project and to other related information within the project. <br />Are you sure you want to proceed with the acceptance?
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
export default AcceptConfirm;
