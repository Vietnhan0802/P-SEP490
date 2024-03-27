import { Modal, Button } from "react-bootstrap";
import { blogInstance, postInstance } from "../../../axios/axiosConfig";
import { useNavigate } from "react-router-dom";
import Notification, { notifySuccess, notifyError } from "../../components/notification";

function DeleteItem({ type, value, show, onClose }) {
    const navigate = useNavigate();
    const handleConfirm = () => {
        if (type === 'post') {
            postInstance.delete(`/RemovePost/${value}`)
                .then((res) => {
                    navigate('/post');
                    notifySuccess("Delete post successfully!");
                })
                .catch((error) => { console.error(error); notifyError("Delete post failed!"); })
        } else {
            blogInstance.delete(`/RemoveBlog/${value}`)
                .then((res) => {
                    navigate('/blog');
                    notifySuccess("Delete blog successfully!");
                })
                .catch((error) => { console.error(error); notifyError("Delete blog failed!"); })
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
