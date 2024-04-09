import React from 'react'
import { Modal, Button } from "react-bootstrap";
import { chatInstance } from '../../axios/axiosConfig';
function DeleteChat({ show, onClose, currentUserId, idConversation,resetConversation }) {
    const handleDeleteConversation = (n) => {
        chatInstance.delete(`RemoveConversation/${currentUserId}/${idConversation}`)
            .then((res) => {onClose();resetConversation();})
            .catch ((error) => { console.error(error) })
}

return (
    <div>
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Delete conversation</Modal.Title>
            </Modal.Header>
            <Modal.Body className="popup-body">
                <p>Do you really want to delete this conversation?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleDeleteConversation}>
                    Submit
                </Button>
            </Modal.Footer>
        </Modal>
    </div>
)
}

export default DeleteChat
