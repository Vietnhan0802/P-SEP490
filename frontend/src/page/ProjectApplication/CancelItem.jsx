import { Modal, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import { projectInstance } from "../../axios/axiosConfig";
import { notifyError, notifySuccess } from "../../components/notification";

function CancelItem({ id, reset, role }) {
    useEffect(() => {
        setRoleMember(role);
    }, [id, role])
    const [roleMember, setRoleMember] = useState('');
    const [show, setShow] = useState(false);
    const modalClose = () => setShow(false);
    const modalShow = () => setShow(true);
    console.log(roleMember)
    const handleConfirm = () => {
        if (roleMember === 'Business') {
            projectInstance.delete(`RemoveInvite/${id}`)
                .then((res) => {
                    setShow(false);
                    reset('Success');
                    notifySuccess("Cancel invite is success!");
                })
                .catch((error) => { console.error(error); notifyError("Cancel invite is fail!"); })
        } else {
            projectInstance.delete(`RemoveApply/${id}`)
                .then((res) => {
                    setShow(false);
                    reset('Success');
                    notifySuccess("Cancel apply is success!");
                })
                .catch((error) => { console.error(error); notifyError("Cancel apply is fail!"); })
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
                    Are you sure you want to cancel this {roleMember === 'Business' ? 'invitation' : 'application'}?
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
