import React, { useEffect, useRef, useState } from 'react'
import { Modal, Button } from "react-bootstrap";
import { blogInstance, postInstance, projectInstance } from '../../../axios/axiosConfig';
import bootstrap from "bootstrap/dist/js/bootstrap.bundle.min";
import { RiCameraOffLine } from "react-icons/ri";
import { IoCameraReverse } from "react-icons/io5";
import ReactQuill from 'react-quill';
import "./update.scss";
import Notification, { notifySuccess, notifyError } from "../../../components/notification";
function UpdateItem({ show, onClose, value, type, resetPage }) {
    const quillRef = useRef(null);
    const [deleteAppear, setDeleteAppear] = useState(false);
    const [update, setUpdate] = useState({
        id: '',
        title: "",
        content: "",
        Images: [], // new state for managing multiple images
        CreateUpdateImages: []
    });
    const fileInputRef = useRef(null);
    useEffect(() => {
        setUpdate({
            id: type === 'post' ? value?.idPost : value?.idBlog,
            title: value?.title,
            content: value?.content,
            Images: type === 'post' ? value?.viewPostImages : value?.viewBlogImages,
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
            setUpdate((prev) => ({ ...prev, CreateUpdateImages: [] }));
            // Use FileReader to convert each file to base64
            const newImages = files.map(async (element) => {
                const base64String = await readFileAsDataURL(element);
                return {
                    image: element.name,
                    imageFile: element,
                    imageSrc: base64String
                };
            });
            Promise.all(newImages).then((convertedImages) => {
                setUpdate((values) => ({
                    ...values,
                    CreateUpdateImages: values.CreateUpdateImages
                        ? [...values.CreateUpdateImages, ...convertedImages]
                        : [...convertedImages], // This ensures it's always an array
                }));
                if (convertedImages.length > 0) {
                    setDeleteAppear(true);
                }
            });

        } else {
            setUpdate((values) => ({ ...values, [name]: value }));
        }
    };
    const handleUpdatePost = () => {
        const quillInstance = quillRef.current?.getEditor();

        if (!quillInstance) {
            notifyError('Failed to get Quill instance');
            return;
        }
        const quillContents = quillInstance.getContents();

        // Validate the title
        if (!update.title.trim()) {
            notifyError('Please enter a title');
            return;
        }

        // Validate the content
        if (quillContents.ops.length === 1 && quillContents.ops[0].insert === '\n') {
            notifyError('Please enter some content');
            return;
        }
        const formData = new FormData();
        formData.append("title", update.title);
        formData.append("content", update.content);
        // update.UpdateImages.length
        console.log(update?.CreateUpdateImages?.length > 0 && type === 'post')
        if (type === 'post') {
            if (update?.CreateUpdateImages?.length > 0) {
                update.CreateUpdateImages.forEach((imageInfo, index) => {
                    formData.append(
                        `CreateUpdatePostImages[${index}].image`,
                        imageInfo.image
                    );
                    formData.append(
                        `CreateUpdatePostImages[${index}].imageFile`,
                        imageInfo.imageFile
                    );

                });
            }
            postInstance.put(`/UpdatePost/${update.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    accept: "application/json",
                },
            })
                .then((res) => { console.log(res?.data?.result); notifySuccess("Update post successfully!"); resetPage(); onClose(); })
                .catch((error) => { console.error(error); notifyError("Update post failed!"); });
        } else if (type === 'blog') {
            if (update?.CreateUpdateImages?.length > 0) {
                update.CreateUpdateImages.forEach((imageInfo, index) => {
                    formData.append(
                        `CreateUpdateBlogImages[${index}].image`,
                        imageInfo.image
                    );
                    formData.append(
                        `CreateUpdateBlogImages[${index}].imageFile`,
                        imageInfo.imageFile
                    );
                });
            }
            blogInstance.put(`/UpdateBlog/${update.id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    accept: "application/json",
                },
            })
                .then((res) => { console.log(res?.data?.result); notifySuccess("Update blog successfully!"); resetPage(); onClose(); })
                .catch((error) => { console.error(error); notifyError("Update blog failed!"); });

        }


    }
    const carouselRef = useRef(null);
    const handleContentChange = (newValue) => {
        setUpdate((prev) => ({ ...prev, content: newValue }));
    };
    useEffect(() => {
        if (carouselRef.current) {
            var carouselInstance = new bootstrap.Carousel(carouselRef.current, {
                interval: 99999999,
                wrap: true,
            });
        }

        return () => {
            if (carouselInstance) {
                carouselInstance.dispose();
            }
        };
    }, []);
    const modules = {
        toolbar: [
            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],
            ['link', 'image', 'video', 'formula'],

            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction

            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],

            ['clean']                                         // remove formatting button
        ],
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ];
    const handleDeleteImage = () => {
        setUpdate((prev) => ({ ...prev, CreateUpdateImages: [] }));
        setDeleteAppear(false);
    }
    const handleClick = () => {
        fileInputRef.current.click();
    };
    return (
        <div className="">
            <Modal show={show} onHide={onClose} id="cus-update-w">
                <Modal.Header closeButton>
                    <Modal.Title>Update {type === 'post' ? 'post' : 'blog'}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="popup-body" id="form-update-project">
                    <div className="row">
                        <div className="col-6 image-container d-flex justify-content-center position-relative">
                            {update?.CreateUpdateImages?.length > 0 ?
                                <div
                                    id={`carouselExampleControls-${update.id}`}
                                    className="carousel slide"
                                    data-bs-ride="carousel"
                                    ref={carouselRef} // Thêm tham chiếu này
                                >
                                    <div className="carousel-inner">
                                        {update.CreateUpdateImages?.map((items, index) => (
                                            <div
                                                className={`carousel-item ${index === 0 ? "active" : ""}`}
                                            >
                                                <div className="image-container d-flex justify-content-center">
                                                    <img
                                                        src={items.imageSrc}
                                                        className="d-block w-100"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {update.CreateUpdateImages?.length > 1 && (
                                        <>
                                            <button
                                                className="carousel-control-prev"
                                                type="button"
                                                data-bs-target={`#carouselExampleControls-${update.id}`}
                                                data-bs-slide="prev"
                                            >
                                                <span
                                                    className="carousel-control-prev-icon"
                                                    style={{
                                                        backgroundColor: "rgba(128, 128, 128, 0.6)",
                                                        padding: "15px",
                                                    }}
                                                    aria-hidden="true"
                                                ></span>
                                                <span className="visually-hidden">Previous</span>
                                            </button>
                                            <button
                                                className="carousel-control-next"
                                                type="button"
                                                data-bs-target={`#carouselExampleControls-${update.id}`}
                                                data-bs-slide="next"
                                            >
                                                <span
                                                    className="carousel-control-next-icon"
                                                    style={{
                                                        backgroundColor: "rgba(128, 128, 128, 0.6)",
                                                        padding: "15px",
                                                    }}
                                                    aria-hidden="true"
                                                ></span>
                                                <span className="visually-hidden">Next</span>
                                            </button>
                                        </>
                                    )}
                                </div> : <div
                                    id={`carouselExampleControls-${update.id}`}
                                    className="carousel slide"
                                    data-bs-ride="carousel"
                                    ref={carouselRef} // Thêm tham chiếu này
                                >
                                    <div className="carousel-inner">
                                        {update.Images?.map((items, index) => (
                                            <div
                                                className={`carousel-item ${index === 0 ? "active" : ""}`}
                                            >
                                                <div className="image-container d-flex justify-content-center">
                                                    <img
                                                        src={items.imageSrc}
                                                        className="d-block w-100"
                                                        alt=""
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {update.Images?.length > 1 && (
                                        <>
                                            <button
                                                className="carousel-control-prev"
                                                type="button"
                                                data-bs-target={`#carouselExampleControls-${update.id}`}
                                                data-bs-slide="prev"
                                            >
                                                <span
                                                    className="carousel-control-prev-icon"
                                                    style={{
                                                        backgroundColor: "rgba(128, 128, 128, 0.6)",
                                                        padding: "15px",
                                                    }}
                                                    aria-hidden="true"
                                                ></span>
                                                <span className="visually-hidden">Previous</span>
                                            </button>
                                            <button
                                                className="carousel-control-next"
                                                type="button"
                                                data-bs-target={`#carouselExampleControls-${update.id}`}
                                                data-bs-slide="next"
                                            >
                                                <span
                                                    className="carousel-control-next-icon"
                                                    style={{
                                                        backgroundColor: "rgba(128, 128, 128, 0.6)",
                                                        padding: "15px",
                                                    }}
                                                    aria-hidden="true"
                                                ></span>
                                                <span className="visually-hidden">Next</span>
                                            </button>
                                        </>
                                    )}

                                </div>}
                            <IoCameraReverse
                                className="update-img-btn"
                                onClick={handleClick}
                            />
                            {deleteAppear && <RiCameraOffLine
                                className="update-img-btn"
                                style={{ bottom: '55px' }}
                                onClick={handleDeleteImage}
                            />}

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
                            <ReactQuill
                                theme="snow"
                                value={update?.content}
                                onChange={handleContentChange}
                                modules={modules}
                                formats={formats}
                                className="mb-3 mt-2  m-h-2"

                                ref={quillRef}
                            />
                            {/* <textarea
                                type="text"
                                value={update?.content}
                                name="content"
                                onChange={handleInputChange}
                                className="input-text form-control mb-3 w-100 h-50"
                                placeholder="Post Content"
                            /> */}
                        </div>
                    </div>
                    <input
                        type="file"
                        name="images"
                        onChange={handleInputChange}
                        className="form-control"
                        ref={fileInputRef}
                        multiple
                        style={{ display: "none" }} // Hide the input
                    />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={(onClose)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdatePost}        >
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default UpdateItem
