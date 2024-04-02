import React, { useEffect, useState } from 'react'
import { Button, Modal, Row, Col } from 'react-bootstrap'
import { Line, Circle } from 'rc-progress';
import { MdStar } from "react-icons/md";
import { projectInstance } from '../../axios/axiosConfig';
import { Rating } from 'react-simple-star-rating'
import tick from "../../images/common/verifiedTick.png";
import Feedback from 'react-bootstrap/esm/Feedback';
function RatingProfile({ show, onClose, role, id, formatDateString }) {
    const [memberRating, setMemberRating] = useState({});
    const [memberFeedback, setMemberFeedback] = useState([]);
    useEffect(() => {
        if (role === 'Member') {
            projectInstance.get(`GetAllRatingStarPeople/${id}`)
                .then((res) => { setMemberRating(res?.data); })
                .catch((error) => { console.log(error) });
            projectInstance.get(`GetAllRatingPeople/${id}`)
                .then((res) => { setMemberFeedback(res?.data?.result); })
                .catch((error) => { console.log(error) });
        } else {
            projectInstance.get(`GetAllRatingStarBusiness/${id}`)
                .then((res) => { setMemberRating(res?.data); })
                .catch((error) => { console.log(error) });
            projectInstance.get(`GetAllRatingBusiness/${id}`)
                .then((res) => { setMemberFeedback(res?.data?.result); })
                .catch((error) => { console.log(error) });
        }

    }, [id])
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
                                    <Line percent={memberRating?.rating5} strokeWidth={2} trailWidth={2} style={{ height: '10px', width: '100%' }} strokeColor="rgb(255, 188, 11)" />
                                </div>
                                <div className='d-flex mt-2 align-items-center'>
                                    <p className='d-flex justify-content-center align-items-center  me-3'>4 <MdStar style={{ color: 'rgb(255, 188, 11)' }} /></p>
                                    <Line percent={memberRating?.rating4} strokeWidth={2} trailWidth={2} style={{ height: '10px', width: '100%' }} strokeColor="rgb(255, 188, 11)" />
                                </div>
                                <div className='d-flex mt-2 align-items-center'>
                                    <p className='d-flex justify-content-center align-items-center me-3'>3 <MdStar style={{ color: 'rgb(255, 188, 11)' }} /></p>
                                    <Line percent={memberRating?.rating3} strokeWidth={2} trailWidth={2} style={{ height: '10px', width: '100%' }} strokeColor="rgb(255, 188, 11)" />
                                </div>
                                <div className='d-flex mt-2 align-items-center'>
                                    <p className='d-flex justify-content-center align-items-center me-3'>2 <MdStar style={{ color: 'rgb(255, 188, 11)' }} /></p>
                                    <Line percent={memberRating?.rating2} strokeWidth={2} trailWidth={2} style={{ height: '10px', width: '100%' }} strokeColor="rgb(255, 188, 11)" />
                                </div>
                                <div className='d-flex mt-2 align-items-center'>
                                    <p className='d-flex justify-content-center align-items-center me-3'>1 <MdStar style={{ color: 'rgb(255, 188, 11)' }} /></p>
                                    <Line percent={memberRating?.rating1} strokeWidth={2} trailWidth={2} style={{ height: '10px', width: '100%' }} strokeColor="rgb(255, 188, 11)" />
                                </div>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className='d-flex flex-column align-items-center'>
                                <h1 className='my-3'>{memberRating?.ratingAvg}</h1>
                                <Rating
                                    readonly={true}
                                    allowFraction={true}
                                    initialValue={memberRating?.ratingAvg}
                                />
                                <p className='mt-3'>{memberRating?.ratingNum} feed{memberRating?.ratingNum > 1 ? 's' : ''} back</p>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <div>
                            {memberFeedback?.map((feedback) => <div>
                                <div className='d-flex align-items-center ms-2 mt-2'>
                                    <div className="position-relative">
                                        <img src={feedback?.avatar} style={{ width: '50px', height: '50px' }} alt="" />
                                        {feedback?.isVerified && <img src={tick} alt="tick" className="position-absolute bottom-0 end-0" style={{ width: '18px' }} />}
                                    </div>
                                    <p className='ms-3'>{feedback?.fullName}</p>
                                </div>
                                <p  className='d-flex align-items-center ms-2 mt-2'>{feedback?.projectName}</p>

                                <div className='d-flex align-items-center ms-2'>
                                    <div>
                                        <Rating
                                            className='mt-2'
                                            size={18}
                                            initialValue={feedback?.rating}
                                            readonly={true}
                                        />
                                    </div>
                                    <p className='ms-2' style={{ marginTop: '12px' }}>{formatDateString(feedback?.createdDate)}</p>

                                </div>
                                <p className='mt-2 ms-2'>{feedback?.comment}</p>
                            </div>)}
                        </div>


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
