import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { projectInstance } from "../../axios/axiosConfig";

function CancelItem({ id, reset, role }) {
    const [show, setShow] = useState(false);
    const modalClose = () => setShow(false);
    const modalShow = () => setShow(true);
    const handleConfirm = () => {
        if (role === 'Business') {
            projectInstance.delete(`RemoveInvite/${id}`)
                .then((res) => {
                    setShow(false);
                    reset('Success');
                })
                .catch((error) => { console.error(error); })
        } else {
            projectInstance.delete(`RemoveApply/${id}`)
                .then((res) => {
                    setShow(false);
                    reset('Success');
                })
                .catch((error) => { console.error(error); })
        }

    }
    return (
        <div className="p-1">
            <Button variant="danger" onClick={modalShow}>
                Cancel
            </Button>
            <Modal show={show} onHide={modalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation</Modal.Title>
                </Modal.Header>

                <Modal.Body className="popup-body" id="">
                    Are you sure you want to cancel this {role === 'Business' ? 'invitation' : 'application'}?
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
export default CancelItem;
