import React from "react";
import { Modal, Button } from "react-bootstrap";
import { blogInstance, postInstance } from "../../../axios/axiosConfig";
import {
  notifySuccess,
  notifyError,
} from "../../../components/notification";
function DeleteComment({ type, id, show, onClose ,setResetCmt}) {
  const handleConfirm = () => {
    if (type === "post") {
      postInstance
        .delete(`RemovePostComment/${id}`)
        .then((res) => {
          onClose();
          setResetCmt();
          notifySuccess("Delete comment successfully!");
        })
        .catch((error) => {
          console.error(error);
          notifyError("Delete comment failed!");
        });
    } else {
        blogInstance.delete(`RemoveBlogComment/${id}`)
            .then(
              (res) => {
                onClose();
                setResetCmt();
                notifySuccess("Delete comment successfully!");
              }
            ).catch((error) => {
              console.error(error);
              notifyError("Delete comment failed!");
            })
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
          Do you really want to delete this comment?
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

export default DeleteComment;
