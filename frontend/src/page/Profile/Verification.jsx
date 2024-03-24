import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap';
import { MdVerified } from 'react-icons/md';
import { reportInstance } from '../../axios/axiosConfig';

function Verification({ id }) {
    const [show, setShow] = useState(false);

    const modalShow = () => setShow(true);
    const modalClose = () => {
        setShow(false);
    }
    const modalSubmit = () => {
        reportInstance.post(`CreateVerification/${id}`)
            .then((res) => {
                setShow(false);
            })
            .catch((error) => {
                console.error(error);
            })
    }
    return (
        <div>
            <MdVerified onClick={modalShow} size={28} />
            <Modal show={show} onHide={modalClose} id="update-infomation">
                <Modal.Header closeButton>
                    <Modal.Title>Verification</Modal.Title>
                </Modal.Header>
                <Modal.Body className="popup-body report-popup " id="report-body">

                    <p> Thank you for submitting your identity verification application. Your application has been received successfully and is now being processed.
                        <br />
                        <br />
                        The identity verification process will take place outside of our system. One of our representatives will contact you as soon as possible to complete the verification process.
                        <br />
                        <br />
                        Please be patient and await our response. This process may take some time to complete.
                        <br />
                        <br />
                        Once your identity is verified, you will be notified and will have full access to the features and privileges associated with your role on the system.
                        <br />
                        <br />
                        If you have any questions, please contact us at  <a href="mailto:support@example.com?subject=Verification Inquiry"> support@example.com</a></p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={modalClose}>
                        Close
                    </Button>
                    <Button variant="warning" onClick={modalSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Verification
