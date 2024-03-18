import React, { useEffect, useRef, useState } from 'react'
import { Modal, Button } from "react-bootstrap";
import { postInstance, projectInstance } from '../../../axios/axiosConfig';
import { IoCameraReverse } from "react-icons/io5";
import "./update.scss"
function UpdateItem({ show, onClose, value }) {

    const [project, setProject] = useState([]);
    const [update, setUpdate] = useState({
        id: '',
        title: "",
        content: "",
        UpdateImages: [], // new state for managing multiple images
        project: "",
        imageFile: null,
        imageSrc:''
    });
    const fileInputRef = useRef(null);
    useEffect(() => {
        setUpdate({
            id: value?.idPost,
            title: value?.title,
            content: value?.content,
            CreateUpdatePostImages: value?.viewPostImages,
        });
        projectInstance.get("GetAllProjects")
            .then((res) => {
                setProject(res?.data?.result);
            })
            .catch((error) => {
                console.error(error);
            });
    }, [show])
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
    const handleInputChange = (event) => {
        const { name, value, type } = event.target;
        if (type === "file") {
            const files = Array.from(event.target.files);

            // Use FileReader to convert each file to base64
            const newImages = files.map(async (element) => {
                const base64String = await readFileAsDataURL(element);
                return {
                    image: element.name,
                    imageFile: element,
                    imageSrc: base64String,
                };
            });
            Promise.all(newImages).then((convertedImages) => {
                setUpdate((values) => ({
                    ...values,
                    CreateUpdatePostImages: [
                        ...values.CreateUpdatePostImages,
                        ...convertedImages,
                    ],
                }));
            });
        } else {
            setUpdate((values) => ({ ...values, [name]: value }));
        }
    };
    const handleUpdatePost = () => {
        const formData = new FormData();
        formData.append("title", update.title);
        formData.append("content", update.content);
        // update.UpdateImages.length
        update.CreateUpdatePostImages.forEach((imageInfo, index) => {
            formData.append(
                `CreateUpdatePostImages[${index}].image`,
                imageInfo.image
            );
            formData.append(
                `CreateUpdatePostImages[${index}].imageFile`,
                imageInfo.imageFile
            );
            formData.append(
                `CreateUpdatePostImages[${index}].imageSrc`,
                imageInfo.imageSrc
            );
        });
        postInstance.put(`UpdatePost/${update.id}`, formData)
            .then((res) => { console.log(res?.data?.result) })
            .catch((error) => { console.error(error) });

    }
    console.log(update)
    const handleClick = () => {
        fileInputRef.current.click();
    };
    return (
        <div className="">
            <Modal show={show} onHide={onClose} id="cus-w">
                <Modal.Header closeButton>
                    <Modal.Title>Update post</Modal.Title>
                </Modal.Header>
                <Modal.Body className="popup-body" id="form-update-project">
                    <div className="row">
                        <div className="col-6 image-container d-flex justify-content-center pos-re">
                            {update.imageFile ? (update?.CreateUpdatePostImages?.map((item) => (
                                <img src={item.imageSrc} alt="img" />
                            ))) : <img src={update.imageFile} />}
                            <IoCameraReverse
                                className="update-img-btn"
                                onClick={handleClick}
                            />
                        </div>
                        <div className="col-6">
                            <input
                                type="text"
                                name="title"
                                value={update?.title}
                                onChange={handleInputChange}
                                className="input-text form-control mb-3"
                                placeholder="Post Title"
                            />
                            <textarea
                                type="text"
                                value={update?.content}
                                name="content"
                                onChange={handleInputChange}
                                className="input-text form-control mb-3 w-100"
                                placeholder="Post Content"
                            />
                            <label>Select a project(optional):</label>
                            <select
                                id="dropdown"
                                name="project"
                                value={project.idProject}
                                onChange={handleInputChange}
                            >
                                <option value="">Select a project</option>
                                {project?.map((item) => (
                                    <option key={item.idProject} value={item.idProject}>
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <input
                        type="file"
                        name="images"
                        onChange={handleInputChange}
                        className="form-control"
                        ref={fileInputRef}
                        style={{ display: "none" }} // Hide the input
                    />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={(onClose)}>
                        Close
                    </Button>
                    <Button variant="primary"
                        onClick={handleUpdatePost}
                    >
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default UpdateItem
