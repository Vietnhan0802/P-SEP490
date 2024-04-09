import React, { useEffect, useState } from 'react'
import { Button, Modal, Row, Col } from 'react-bootstrap'
import { Line } from 'rc-progress';
import { Rating } from 'react-simple-star-rating'
import { MdStar } from "react-icons/md";
import Dropdown from "react-bootstrap/Dropdown";
import { GrUpdate } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import './feedback.scss'
import tick from "../../../images/common/verifiedTick.png";
import { projectInstance } from '../../../axios/axiosConfig';
function RatingFeedback({ show, onClose, formatDateString, idProject, idUser, type, resetPage, currentUserId }) {
    const [projectRating, setprojectRating] = useState({});
    const [projectFeedback, setprojectFeedback] = useState([]);
    const [resetFeedback, setResetFeedback] = useState(false);
    const [updateFeedback, setUpdateFeedback] = useState('');
    const [feedbackToUpdate, setFeedbackToUpdate] = useState(null);
    const [rating, setRating] = useState(0);
    useEffect(() => {
        if (type === 'member') {
            projectInstance.get(`GetAllRatingStarPeopleInProject/${idUser}/${idProject}`)
                .then((res) => { setprojectRating(res?.data); resetPage(); })
                .catch((error) => { console.log(error) });
            projectInstance.get(`GetAllRatingPeopleInProject/${idUser}/${idProject}`)
                .then((res) => { setprojectFeedback(res?.data?.result); resetPage(); })
                .catch((error) => { console.log(error) });
        } else {
            projectInstance.get(`GetAllRatingStarProject/${idProject}`)
                .then((res) => { setprojectRating(res?.data); resetPage(); })
                .catch((error) => { console.log(error) });
            projectInstance.get(`GetAllRatingProject/${idProject}`)
                .then((res) => { setprojectFeedback(res?.data?.result); resetPage(); })
                .catch((error) => { console.log(error) });
        }

    }, [idProject, idUser, type, resetFeedback])
    // Catch Rating value
    const handleRating = (rate) => {
        setRating(rate)        // other logic
    }
    const handleUpdateFeedback = (feedback, comment) => {
        console.log(comment)
        setFeedbackToUpdate(feedback);
        setUpdateFeedback(comment);
    }
    const handleDeleteRating = (idRating) => {
        projectInstance.delete(`RemoveRating/${idRating}`)
            .then((res) => { resetPage(); setResetFeedback(!resetFeedback) })
            .catch((error) => { console.log(error) });
    }
    const handleUpdateRating = (idRating) => {
        projectInstance.put(`UpdateRating/${idRating}`, {
            rating: rating,
            comment: updateFeedback
        })
            .then((res) => { resetPage(); setResetFeedback(!resetFeedback) })
            .catch((error) => { console.log(error) });
    }
    return (
        <div>
            <Modal show={show} onHide={onClose} id="ratingFeedback">
                <Modal.Header closeButton>
                    <Modal.Title>Rating Feedback</Modal.Title>
                </Modal.Header>
                <Modal.Body className="popup-body">
                    <Row>
                        <Col md={8}>
                            <div className='p-3'>
                                <div className='d-flex mt-2 align-items-center'>
                                    <p className='d-flex justify-content-center align-items-center me-3'>5 <MdStar style={{ color: 'rgb(255, 188, 11)' }} /></p>
                                    <Line percent={projectRating?.rating5} strokeWidth={2} trailWidth={2} style={{ height: '10px', width: '100%' }} strokeColor="rgb(255, 188, 11)" />
                                </div>
                                <div className='d-flex mt-2 align-items-center'>
                                    <p className='d-flex justify-content-center align-items-center  me-3'>4 <MdStar style={{ color: 'rgb(255, 188, 11)' }} /></p>
                                    <Line percent={projectRating?.rating4} strokeWidth={2} trailWidth={2} style={{ height: '10px', width: '100%' }} strokeColor="rgb(255, 188, 11)" />
                                </div>
                                <div className='d-flex mt-2 align-items-center'>
                                    <p className='d-flex justify-content-center align-items-center me-3'>3 <MdStar style={{ color: 'rgb(255, 188, 11)' }} /></p>
                                    <Line percent={projectRating?.rating3} strokeWidth={2} trailWidth={2} style={{ height: '10px', width: '100%' }} strokeColor="rgb(255, 188, 11)" />
                                </div>
                                <div className='d-flex mt-2 align-items-center'>
                                    <p className='d-flex justify-content-center align-items-center me-3'>2 <MdStar style={{ color: 'rgb(255, 188, 11)' }} /></p>
                                    <Line percent={projectRating?.rating2} strokeWidth={2} trailWidth={2} style={{ height: '10px', width: '100%' }} strokeColor="rgb(255, 188, 11)" />
                                </div>
                                <div className='d-flex mt-2 align-items-center'>
                                    <p className='d-flex justify-content-center align-items-center me-3'>1 <MdStar style={{ color: 'rgb(255, 188, 11)' }} /></p>
                                    <Line percent={projectRating?.rating1} strokeWidth={2} trailWidth={2} style={{ height: '10px', width: '100%' }} strokeColor="rgb(255, 188, 11)" />
                                </div>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className='d-flex flex-column align-items-center justify-content-between'>
                                <h1 className='my-3'>{Math.round(projectRating?.ratingAvg * 100) / 100}</h1>
                                <Rating
                                    readonly={true}
                                    allowFraction={true}
                                    initialValue={projectRating?.ratingAvg}
                                />
                                <p className='mt-3'>{projectRating?.ratingNum} feed{projectRating?.ratingNum > 1 ? 's' : ''} back</p>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <div className='w-100'>
                            {projectFeedback?.map((feedback, index) => <div key={index}>
                                <div className='d-flex align-items-center ms-2 mt-2 w-100 justify-content-between'>
                                    <div className='d-flex align-items-center '>
                                        <div className="position-relative">
                                            <img src={feedback?.avatar} style={{ width: '50px', height: '50px', borderRadius: '50%' }} alt="" />
                                            {feedback?.isVerified && <img src={tick} alt="tick" className="position-absolute bottom-0 end-0" style={{ width: '18px' }} />}
                                        </div>
                                        <p className='ms-3'>{feedback?.fullName}</p>
                                    </div>
                                    <div>
                                        {feedback?.idRater === currentUserId ? (
                                            <Dropdown id='feedback'>
                                                <Dropdown.Toggle
                                                    as={Button}
                                                    variant="white"
                                                    className="border-none text-body"
                                                    style={{
                                                        "&::after": {
                                                            content: 'none',
                                                            border: "none",
                                                            display: "none !important"
                                                        },
                                                    }}
                                                >
                                                    <BsThreeDots size={14} />
                                                </Dropdown.Toggle>

                                                <Dropdown.Menu style={{ minWidth: "auto" }}>
                                                    <Dropdown.Item
                                                        className="d-flex justify-content-center"
                                                        onClick={() => handleUpdateFeedback(feedback, feedback?.comment)}
                                                    >
                                                        <GrUpdate size={14} />
                                                    </Dropdown.Item>
                                                    <Dropdown.Item
                                                        className="d-flex justify-content-center"
                                                        onClick={() =>
                                                            handleDeleteRating(feedback.idRating)
                                                        }
                                                    >
                                                        <MdDelete size={14} />
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        ) : (''
                                        )
                                        }
                                    </div>
                                </div>
                                {console.log(feedback?.comment)}
                                {feedbackToUpdate === feedback ? (
                                    <div>
                                        <div>
                                            <Rating size={18} readonly={false}
                                                onClick={handleRating}
                                            />
                                            <input
                                                type="text"
                                                className="mt-2 form-control"
                                                value={updateFeedback}
                                                onChange={(event) => setUpdateFeedback(event.target.value)}
                                            />
                                        </div>
                                        <div className='mt-2'>
                                            <button
                                                className="btn btn-outline-primary"
                                                onClick={() => setFeedbackToUpdate(null)}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className=" ms-3 btn btn-outline-info"
                                                onClick={() => handleUpdateRating(feedback?.idRating)}
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="d-flex align-items-center ms-2 mt-2">
                                            <div>
                                                <Rating
                                                    className="mt-2"
                                                    size={18}
                                                    initialValue={feedback?.rating}
                                                    readonly={true}
                                                />
                                            </div>
                                            <p className="ms-2" style={{ marginTop: '12px' }}>
                                                {formatDateString(feedback?.createdDate)}
                                            </p>
                                        </div>
                                        <p className="mt-2 ms-2">{feedback?.comment}</p>
                                    </>
                                )}


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

export default RatingFeedback
