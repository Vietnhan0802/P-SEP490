import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { Rating } from 'react-simple-star-rating'
import { projectInstance } from '../../../axios/axiosConfig'
import { notifyError, notifySuccess } from '../../../components/notification'
function RatingPopup({ show, onClose, idRater, idRated, projectid, type, idProjectMember, resetPage }) {
    const handleRatingProject = () => {
        if (type === 'project') {
            projectInstance.post(`CreateRatingProject/${idRater}/${projectid}`, {
                rating: rating,
                comment: input
            })
                .then((res) => { notifySuccess(res?.data?.message); resetPage(); onClose(); })
                .catch((error) => { notifyError(error?.data?.message) })
        } else {
            projectInstance.post(`CreateRatingPeople/${idRater}/${idRated}/${idProjectMember}`, {
                rating: rating,
                comment: input
            })
                .then((res) => { notifySuccess(res?.data?.message); resetPage(); onClose(); })
                .catch((error) => { notifyError(error?.data?.message) })
        }

    }
    const [rating, setRating] = useState(0);
    const [input, setInput] = useState('');

    const handleFeedbackInput = (event) => {
        setInput(event.target.value);
    }
    // Catch Rating value
    const handleRating = (rate) => {
        setRating(rate)
    }
    return (
        <div>
            <Modal show={show} onHide={onClose} >
                <Modal.Header closeButton>
                    <Modal.Title>Rating {type === 'project' ? 'Project' : 'Member'}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="popup-body">
                </Modal.Body>
                <div className='d-flex justify-content-between align-items-center mb-3 mx-5 '>
                    <p>{type === 'project' ? 'Project Quality :' : 'Rate member :'}</p>
                    <Rating
                        onClick={handleRating}
                        className=''
                    />
                </div>
                <div className='d-flex justify-content-between align-items-center mx-5 form-floating mb-3' style={{ height: '200px' }}>
                    <textarea
                        type="text"
                        className='form-control w-100 h-100'
                        value={input}
                        onChange={handleFeedbackInput}
                        id="floatingInput" placeholder="Feedback" />
                    <label htmlFor="floatingInput " className='w-100'>Feedback</label>
                </div>
                <Modal.Footer>
                    <Button variant="warning" onClick={() => handleRatingProject()}>
                        Confirm
                    </Button>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default RatingPopup
