import React from 'react'
import { Modal, Button } from "react-bootstrap";
import { credentialInstance } from '../../axios/axiosConfig';
import { notifyError, notifySuccess } from '../../components/notification';
function DeleteDegree({ show, onClose, idDegree, resetTab }) {
    console.log(idDegree)
    const modalSubmit = () => {
        credentialInstance.delete(`RemoveDegree/${idDegree}`)
            .then((res) => { notifySuccess(res?.data?.message); resetTab(); onClose(); })
            .catch((error) => { notifyError(error) })
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
