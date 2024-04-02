import React from 'react'
import { Button, Modal, Row, Col } from 'react-bootstrap'
import { Line, Circle } from 'rc-progress';
import { MdStar } from "react-icons/md";
function RatingProfile({ show, onClose }) {
    return (
        <div>
            <Modal show={show} onHide={onClose} id="update-infomation">
                <Modal.Header closeButton>
                    <Modal.Title>Rate</Modal.Title>
                </Modal.Header>
                <Modal.Body className="popup-body">
                    <Row>
                        <Col md={8}>
                            <div className='p-3'>
                                <div className='d-flex mt-2 align-items-center'>
                                    <p className='d-flex justify-content-center align-items-center me-3'>5 <MdStar style={{ color: 'rgb(255, 188, 11)' }} /></p>
                                    <Line percent={10} strokeWidth={2} trailWidth={2} style={{ height: '10px', width: '100%' }} strokeColor="rgb(255, 188, 11)" />
                                </div>
                                <div className='d-flex mt-2 align-items-center'>
                                    <p className='d-flex justify-content-center align-items-center  me-3'>4 <MdStar style={{ color: 'rgb(255, 188, 11)' }} /></p>
                                    <Line percent={10} strokeWidth={2} trailWidth={2} style={{ height: '10px', width: '100%' }} strokeColor="rgb(255, 188, 11)" />
                                </div>
                                <div className='d-flex mt-2 align-items-center'>
                                    <p className='d-flex justify-content-center align-items-center me-3'>3 <MdStar style={{ color: 'rgb(255, 188, 11)' }} /></p>
                                    <Line percent={10} strokeWidth={2} trailWidth={2} style={{ height: '10px', width: '100%' }} strokeColor="rgb(255, 188, 11)" />
                                </div>
                                <div className='d-flex mt-2 align-items-center'>
                                    <p className='d-flex justify-content-center align-items-center me-3'>2 <MdStar style={{ color: 'rgb(255, 188, 11)' }} /></p>
                                    <Line percent={10} strokeWidth={2} trailWidth={2} style={{ height: '10px', width: '100%' }} strokeColor="rgb(255, 188, 11)" />
                                </div>
                                <div className='d-flex mt-2 align-items-center'>
                                    <p className='d-flex justify-content-center align-items-center me-3'>1 <MdStar style={{ color: 'rgb(255, 188, 11)' }} /></p>
                                    <Line percent={10} strokeWidth={2} trailWidth={2} style={{ height: '10px', width: '100%' }} strokeColor="rgb(255, 188, 11)" />
                                </div>
                            </div>
                        </Col>
                        <Col md={4}>
                            
                        </Col>
                    </Row>


                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div >
    )
}

export default RatingProfile
