
import React, { useState, useRef, useEffect } from 'react'
import defaultImage from "../../images/common/default.png";
import "../Profile/profile.scss";
import { Modal, Button } from "react-bootstrap";
import { userInstance } from '../../axios/axiosConfig';
import Notification, { notifySuccess, notifyError } from "../../../src/components/notification";
function UpdateAvatarPu({ show, onClose, image, currentUserId, changeImage }) {

    const [display, setDisplay] = useState(show);
    const [avatar, setAvatar] = useState({});

    useEffect(() => {
        setDisplay(show);
        setAvatar({
            avatar: "default",
            imageSrc: image,
            imageFile: null,
        })
    }, [show]);
    const fileInputRef = useRef(null);
    const handleClick = () => {
        fileInputRef.current.click();
    };
    const showPreview = (e) => {
        if (e.target.files && e.target.files[0]) {
            let imageFile = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (x) => {
                setAvatar(prevState => ({
                    ...prevState,
                    imageFile,
                    imageSrc: x.target.result,
                }));
            };
            reader.readAsDataURL(imageFile);
        } else {
            setAvatar({
                ...avatar,
                imageFile: null,
                imageSrc: image,
            });
        }
    };
    const handleUpdateAvatar = (e) => {
        e.preventDefault();
        if (image === avatar.imageSrc) {
            onClose(false);
            return;
        }
        const formData = new FormData();
        formData.append("avatar", avatar.avatar);
        formData.append("ImageFile", avatar.imageFile);
        formData.append("ImageSrc", avatar.imageSrc);
        userInstance
            .put(`/UpdateAvatar/${currentUserId}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data", // Ensure Content-Type is set to multipart/form-data
                },
            })
            .then((res) => {
                onClose(false);
                if (res?.data?.status === "OK") {
                    changeImage('ok');
                    notifySuccess("Update avatar is success!");
                }
            })
            .catch((err) => {
                console.log(err?.response?.data);
                notifyError("Update avatar is fail!");
            });
    };
    return (
        <div className='d-flex flex-row justify-content-center'>
            <Modal show={display} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Avatar</Modal.Title>
                </Modal.Header>
                <Modal.Body className="popup-body d-flex ">
                    <img
                        src={
                            avatar.imageSrc === "https://localhost:7006/Images/"
                                ? defaultImage
                                : avatar.imageSrc
                        }

                        alt=""
                        style={{ borderRadius: "50%" }}
                        className="avatar m-auto"
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={showPreview}
                        className="my-2"
                        ref={fileInputRef}
                        style={{ display: "none" }} // Hide the input
                    />
                    <button
                        onClick={handleClick}
                        className="btn btn-primary m-auto"
                    >
                        {" "}
                        Upload Avatar
                    </button>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={(onClose)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdateAvatar}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default UpdateAvatarPu
