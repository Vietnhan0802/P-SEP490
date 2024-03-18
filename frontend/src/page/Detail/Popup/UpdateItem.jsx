import React, { useEffect, useState } from 'react'
import { Modal, Button } from "react-bootstrap";
function UpdateItem({ show, onClose }) {

    const [display, setDisplay] = useState();
    useEffect(() => {
        setDisplay(show);
    }, []);
    // const modalClose = () => setShow(false);
    // const modalShow = () => setShow(true);
    return (
        <div className="">
            <Modal show={display} onHide={onClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Post</Modal.Title>
                </Modal.Header>
                <Modal.Body className="popup-body">
                    <input
                        type="text"
                        name="title"
                        //   value={inputs.title}
                        //   onChange={handleInputChange}
                        className="input-text form-control mb-3"
                        placeholder="title"
                    />
                    <textarea
                        type="text"
                        //   value={inputs.content}
                        //   name="content"
                        //   onChange={handleInputChange}
                        className="input-text form-control mb-3 w-100"
                        placeholder="content"
                    />
                    <input
                        type="file"
                        name="images"
                        //   onChange={handleInputChange}
                        className="form-control"
                        multiple
                    />
                    <label>Select a project(optional):</label>
                    <select
                        id="dropdown"
                        name="project"
                    //   value={inputs.project}
                    //   onChange={handleInputChange}
                    >
                        <option value="">Select a project</option>
                        {/* {project?.map((item) => (
            <option key={item.idProject} value={item.idProject}>
              {item.name}
            </option>
          ))} */}
                    </select>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={(onClose)}>
                        Close
                    </Button>
                    <Button variant="primary"
                    // onClick={handleCreatePost}
                    >
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default UpdateItem
