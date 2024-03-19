import React from 'react'
import { Modal, Button } from "react-bootstrap";
function Alert({ show, onClose, message }) {
    console.log(1)
    return (
        <div className="p-1">
            <Modal show={show} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation Box</Modal.Title>
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

export default Alert
