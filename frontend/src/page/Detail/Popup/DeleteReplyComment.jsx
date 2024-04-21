import React from "react";
import { Modal, Button } from "react-bootstrap";
import { blogInstance, postInstance } from "../../../axios/axiosConfig";
import { useNavigate } from "react-router-dom";
import Notification, {
  notifySuccess,
  notifyError,
} from "../../../components/notification";
function DeleteReplyComment({ type, id, show, onClose, setResetCmt }) {
  const navigate = useNavigate();
  const handleConfirm = () => {
    if (type === "post") {
      postInstance
        .delete(`RemovePostReply/${id}`)
        .then((res) => {
          onClose();
          setResetCmt();
          notifySuccess("Delete reply successfully!");
        })
        .catch((error) => {
          console.error(error);
          notifyError("Delete reply failed!");
        });
    } else {
      blogInstance
        .delete(`RemoveBlogReply/${id}`)
        .then((res) => {
          onClose();
          setResetCmt();
          notifySuccess("Delete reply successfully!");
        })
        .catch((error) => {
          console.error(error);
          notifyError("Delete reply failed!");
        });
    }
  };
  return (
    <div
      className="p-1"
      style={{
        backgroundColor: "var(--header_background)",
        color: "var(--header_search_text)",
      }}
    >
      <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation Box</Modal.Title>
        </Modal.Header>

        <Modal.Body className="popup-body" id="">
          Do you really want to delete this reply?
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
  );
}

export default DeleteReplyComment;
