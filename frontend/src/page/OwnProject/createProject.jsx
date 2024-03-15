import React, { useState } from 'react'
import { useRef } from 'react';
import { Modal, Button } from "react-bootstrap";
import { projectInstance } from '../../axios/axiosConfig';
function CreateProject({reset}) {
    const sessionData = JSON.parse(sessionStorage.getItem('userSession')) || {};
    const { currentUserId } = sessionData;
    const [show, setShow] = useState(false);
    const [resetPage ,setResetPage] = useState("");
    const modalClose = () => setShow(false);
    const modalShow = () => setShow(true);
    const [value, setValue] = useState({
        name: '',
        description: '',
        avatar: '',
        visibility: 1,
        ImageFile: '',
        ImageSrc: ''
    });
    const fileInputRef = useRef(null);
    const handleInputChange = (event) => {
        const { name, value, type } = event.target;
        if (type === "file") {
            const file = event.target.files[0];

            // Use FileReader to convert each file to base64
            const base64String = readFileAsDataURL(file);

            setValue((values) => ({
                ...values,
                avatar: file.name,
                ImageFile: file,
                ImageSrc: base64String,

            }));
            showPreview(event);
        } else {
            setValue((values) => ({ ...values, [name]: value }));
        }
    };
    const showPreview = (e) => {
        if (e.target.files && e.target.files[0]) {
            let imageFile = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (x) => {
                setValue({
                    ...value,
                    avatar: imageFile.name,
                    ImageFile: imageFile,
                    ImageSrc: x.target.result,
                });
            };
            reader.readAsDataURL(imageFile);
        } else {
            setValue({
                ...value,
                ImageFile: null,
                ImageSrc: '',
            });
        }
    };
    const readFileAsDataURL = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                resolve(event.target.result);
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsDataURL(file);
        });
    };
    const handleClick = () => {
        fileInputRef.current.click();
    };
    const handleCreateProject = () => {
        const formData = new FormData();
        formData.append("name", value.name);
        formData.append("description", value.description);
        formData.append("avatar", value.avatar);
        formData.append("visibility", value.visibility);
        formData.append("ImageFile", value.ImageFile);
        formData.append("ImageSrc", value.ImageSrc);
        projectInstance.post(`/CreateProject/${currentUserId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                accept: "application/json",
            },
        }).then(() => {
            reset("Success");
            setValue({
                name: '',
                description: '',
                avatar: '',
                visibility: 1,
                ImageFile: '',
                ImageSrc: ''
            });
            setShow(false);
        })
    };
    return (
        <div>

            <div className="project-form p-2">
                <Button variant="m-0 btn btn-primary me-2" onClick={modalShow}>
                    Create
                </Button>
                <Modal show={show} onHide={modalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create New Post</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="popup-body">
                        <div className="d-flex flex-column">
                            <input
                                type="text"
                                name="name"
                                value={value.name}
                                onChange={handleInputChange}
                                className="input-text w-100"
                                placeholder="Enter Project Name"
                            />
                            <textarea
                                type="text"
                                value={value.description}
                                name="description"
                                onChange={handleInputChange}
                                className="input-text w-100"
                                placeholder="Enter Project Description..."
                            />
                        </div>
                        <div>
                            <div className="d-flex  justify-content-between">
                                <div>
                                    <select
                                        value={value.visibility}
                                        name="visibility"
                                        onChange={handleInputChange}
                                        className="input-text width-200 me-3"
                                        defaultValue={1}
                                    >
                                        <option value={1}>Public</option>
                                        <option value={0}>Private</option>
                                        <option value={2}>Hidden</option>
                                    </select>
                                    <button className="btn btn-outline-primary" onClick={handleClick}>
                                        Add Image
                                    </button>
                                </div>
                                <input
                                    type="file"
                                    name="images"
                                    onChange={handleInputChange}
                                    className="form-control"
                                    multiple
                                    ref={fileInputRef}
                                    style={{ display: "none" }} // Hide the input
                                />
                            </div>
                            <img src={value.ImageSrc} alt="" style={{ width: '50px ' }} />
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={modalClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleCreateProject}>
                            Submit
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    )
}

export default CreateProject
