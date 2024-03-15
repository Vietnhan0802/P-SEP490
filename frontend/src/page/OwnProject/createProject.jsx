import React, { useState } from 'react'
import { useRef } from 'react';
import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';
import { Modal, Button } from "react-bootstrap";
import { projectInstance } from '../../axios/axiosConfig';
function CreateProject({ reset }) {
    const sessionData = JSON.parse(sessionStorage.getItem('userSession')) || {};
    const { currentUserId } = sessionData;
    const animatedComponents = makeAnimated();
    const [show, setShow] = useState(false);
    const modalClose = () => setShow(false);
    const modalShow = () => setShow(true);
    const [value, setValue] = useState({
        name: '',
        description: '',
        avatar: '',
        visibility: 1,
        namePosition: [],
        ImageFile: '',
        ImageSrc: ''
    });


    const [options, setOptions] = useState([
        { value: 'Backend Developer', label: 'Backend Developer' },
        { value: 'Frontend Developer', label: 'Frontend Developer' },
        { value: 'Business Analyst', label: 'Business Analyst' },
        { value: 'Technical lead', label: 'Technical lead' },
        { value: 'Data Engineer', label: 'Data Engineer' },
        { value: 'Scrum Master', label: 'Scrum Master' },
        { value: 'Agile Coach', label: 'Agile Coach' },
        { value: 'Dev-Ops', label: 'Dev-Ops' },
        { value: 'Product Manager', label: 'Product Manager' },
        { value: 'Project Manager', label: 'Project Manager' },
        { value: 'Tester', label: 'Tester' },
        { value: 'QA', label: 'QA' },
        { value: 'QC', label: 'QC' }
    ]);

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
        } else if (name === "namePosition") {
            // Handle change for Select component
            setValue((values) => ({
                ...values,
                [name]: value.map(option => option.value) // Store only values of selected options
            }));
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
        value.namePosition.forEach((position, index) => {
            formData.append(
                `namePosition[${index}]`,
                position
            );
        });
        // formData.append("namePosition", JSON.stringify(value.namePosition)); // Pass namePosition as JSON string
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
                namePosition: [],
                ImageFile: '',
                ImageSrc: ''
            });
            setShow(false);
        })
    };
    const handleSelectChange = (selectedOptions) => {
        const newOptions = selectedOptions.filter(option => !options.some(existingOption => existingOption.value === option.value));
        setOptions(prevOptions => [...prevOptions, ...newOptions]);
        setValue((values) => ({
            ...values,
            namePosition: selectedOptions.map(option => option.value) // Extracting values from selected options
        }));
    };
    return (
        <div>
            <div className="project-form p-2">
                <Button variant="m-0 btn btn-primary me-2" onClick={modalShow}>
                    Create
                </Button>
                <Modal show={show} onHide={modalClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create New Project</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="popup-body">
                        <div className="d-flex flex-column">
                            <div className='form-floating mb-3'>
                                <input
                                    type="text"
                                    name="name"
                                    value={value.name}
                                    onChange={handleInputChange}
                                    className="form-control w-100"
                                    placeholder="Enter Project Name"
                                />
                                <label for="floatingInput">Project name</label>
                            </div>
                            <div className='form-floating mb-3'>
                                <textarea
                                    type="text"
                                    value={value.description}
                                    name="description"
                                    onChange={handleInputChange}
                                    className="form-control w-100 "
                                    placeholder="Enter Project Description..."
                                />
                                <label for="floatingInput">Project description</label>
                            </div>

                            <CreatableSelect
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                placeholder='Select all position needed in project'
                                isMulti
                                isClearable
                                options={options}
                                onChange={handleSelectChange} // Call handleSelectChange on change
                                value={options.filter(option => value.namePosition.includes(option.value))} // Pass selected options as value
                            />
                        </div>
                        <div>
                            <div className="">
                                <div className='w-100 my-3'>
                                    <select
                                        value={value.visibility}
                                        name="visibility"
                                        onChange={handleInputChange}
                                        className="form-select width-200 me-3"
                                        defaultValue={1}
                                    >
                                        <option value={1}>Public</option>
                                        <option value={0}>Private</option>
                                        <option value={2}>Hidden</option>
                                    </select>

                                </div>
                                <button className="btn btn-outline-primary" onClick={handleClick}>
                                    Add Image
                                </button>

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
                        </div>
                        <img src={value.ImageSrc} alt="" className='mt-2' style={{ width: '100% ', borderRadius: '9px', height: 'auto' }} />

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
