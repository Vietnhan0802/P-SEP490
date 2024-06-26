import React from 'react'
import { Modal, Button } from "react-bootstrap";
function AlertProject({ show, onClose, message }) {
    return (
        <div className="p-1">
            <Modal show={show} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Alert Box</Modal.Title>
                </Modal.Header>

                <Modal.Body className="popup-body" id="">
                    {message}
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default AlertProject
