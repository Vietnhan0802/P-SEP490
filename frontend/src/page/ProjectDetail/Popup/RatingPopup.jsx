import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { Rating } from 'react-simple-star-rating'
function RatingPopup({ show, onClose }) {
    const handleRatingProject = () => {

    }
    const [rating, setRating] = useState(0);
    const [input, setInput] = useState('');

    const handleFeedbackInput = (event) => {
        setInput(event.target.value)
    }
    // Catch Rating value
    const handleRating = (rate) => {
        setRating(rate)

        // other logic
    }
    return (
        <div>
            <Modal show={show} onHide={onClose} >
                <Modal.Header closeButton>
                    <Modal.Title>Rating Project</Modal.Title>
                </Modal.Header>

                <Modal.Body className="popup-body">

                </Modal.Body>
                <div className='d-flex justify-content-between align-items-center mb-3 px-5 '>
                    <p>Project Quality :</p>
                    <Rating
                        onClick={handleRating}
                        className=''
                    /* Available Props */
                    />


                </div>
                <div className='d-flex justify-content-between align-items-center mb-3 px-5 ' style={{}}>
                    <input
                        type="text"  
                        value={input}
                        onChange={handleFeedbackInput} />
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
