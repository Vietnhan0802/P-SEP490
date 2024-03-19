import { Modal, Button } from "react-bootstrap";
import { blogInstance, postInstance } from "../../../axios/axiosConfig";
import { useNavigate } from "react-router-dom";

function DeleteItem({ type, value, show, onClose }) {
    const navigate = useNavigate();
    const handleConfirm = () => {
        if (type === 'post') {
            postInstance.delete(`/RemovePost/${value}`)
                .then((res) => {
                    navigate('/post');
                })
                .catch((error) => { console.error(error); })
        } else {
            blogInstance.delete(`/RemoveBlog/${value}`)
                .then((res) => {
                    navigate('/blog');
                })
                .catch((error) => { console.error(error); })
        }

    }
    return (
        <div className="p-1">
            <Modal show={show} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmation Box</Modal.Title>
                </Modal.Header>

                <Modal.Body className="popup-body" id="">
                    Do you really want to delete this {type === 'post' ? 'post' : 'blog'}?
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="warning" onClick={handleConfirm}>
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

export default DeleteItem
