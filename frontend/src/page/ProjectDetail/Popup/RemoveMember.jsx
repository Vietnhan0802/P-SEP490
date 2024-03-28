import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { IoPersonRemove } from "react-icons/io5";
import { projectInstance } from '../../../axios/axiosConfig';
function RemoveMember({ id, resetPage }) {
    const [show, setShow] = useState(false);
    const modalClose = () => { setShow(false); };
    const modalShow = () => { setShow(true); };
    const handleRemoveMember = () => {
        projectInstance.delete(`RemoveMember/${id}`)
            .then((res) => {
                setShow(false);
                resetPage();
            })
            .then((error) => { console.error(error) });
    }
    return (
        <div>
            <IoPersonRemove onClick={modalShow} />
            <Modal show={show} onHide={modalClose} >
                <Modal.Header closeButton>
                    <Modal.Title>Remove Member</Modal.Title>
                </Modal.Header>

                <Modal.Body className="popup-body">
                    <p>Do you really want to remove this meber?</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="warning" onClick={() => handleRemoveMember()}>
                        Confirm
                    </Button>
                    <Button variant="secondary" onClick={modalClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default RemoveMember
