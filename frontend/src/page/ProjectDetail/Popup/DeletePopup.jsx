import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import "../../ProjectDetail/UPF.scss";
import { projectInstance } from "../../../axios/axiosConfig";
import { MdDeleteOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
function DeletePopup({ id }) {
    const [show, setShow] = useState(false);
    const modalClose = () => { setShow(false); };
    const modalShow = () => { setShow(true); };
    const navigate = useNavigate();
    const handleDeleteProject = () => {
        projectInstance.delete(`/RemoveProject/${id}`, {
            headers: {
                "Content-Type": "multipart/form-data",
                accept: "application/json",
            },
        }).then(() => {
            // reset("Success");
            setShow(false);
            navigate('/ownproject');
        })
    };
    return (
        <div className="p-1 ">
            <MdDeleteOutline onClick={modalShow} id="btn-update-project" />
            <Modal show={show} onHide={modalClose} >
                <Modal.Header closeButton>
                    <Modal.Title>Update Project</Modal.Title>
                </Modal.Header>

                <Modal.Body className="popup-body">
                    <p>Do you really want to delete this project?</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="warning" onClick={handleDeleteProject}>
                        Confirm
                    </Button>
                    <Button variant="secondary" onClick={modalClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
export default DeletePopup;
