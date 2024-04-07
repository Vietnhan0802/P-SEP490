import React from 'react'
import { Modal, Button } from "react-bootstrap";
function DeleteDegree({ show, onClose }) {
    const modalSubmit = () => {

    }
    return (
        <div>
            <Modal show={show} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Degree</Modal.Title>
                </Modal.Header>
                <Modal.Body className="popup-body">
                    <p> Do you really want to delete this degree?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={modalSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default DeleteDegree
