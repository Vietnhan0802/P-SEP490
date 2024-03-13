import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import React, { useEffect } from "react";
import "./post-pu.scss";
import Notification, {
  notifySuccess,
  notifyError,
} from "../../components/notification";
import {
  postInstance,
  projectInstance,
  reportInstance,
} from "../../axios/axiosConfig";

function PostPu() {
  const [show, setShow] = useState(false);
  const [project, setProject] = useState();
  const modalClose = () => setShow(false);
  const modalShow = () => setShow(true);
  const modelSubmit = () => setShow(false);
  const [resetPage, setResetPage] = useState(false);
  const sessionData = JSON.parse(sessionStorage.getItem("userSession")) || {};
  const { currentUserId } = sessionData;
  const [inputs, setInputs] = useState({
    title: "",
    content: "",
    CreateUpdatePostImages: [], // new state for managing multiple images
    project: "",
  });
  useEffect(() => {
    projectInstance
      .get("GetAllProjects")
      .then((res) => {
        setProject(res?.data?.result);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const handleCreatePost = () => {
    if (inputs.project === "") {
      alert("Plase choose a project");
    }
    const formData = new FormData();
    formData.append("title", inputs.title);
    formData.append("content", inputs.content);

    inputs.CreateUpdatePostImages.forEach((imageInfo, index) => {
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

    postInstance
      .post(`/CreatePost/${currentUserId}/${inputs.project}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          accept: "application/json",
        },
      })
      .then((res) => {
        // console.log(res.data);
        setResetPage(!resetPage);
        setInputs({
          title: "",
          content: "",
          CreateUpdatePostImages: [], // new state for managing multiple images
          project: "",
        });
        notifySuccess("Create post successfully!");
      })
      .catch((err) => {
        console.log(err);
        notifyError("Create post failed!");
      });
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
        setInputs((values) => ({
          ...values,
          CreateUpdatePostImages: [
            ...values.CreateUpdatePostImages,
            ...convertedImages,
          ],
        }));
      });
    } else {
      setInputs((values) => ({ ...values, [name]: value }));
    }
  };
  return (
    <div className="">
      <Button variant="m-0 btn btn-primary me-2" onClick={modalShow}>
        Create
      </Button>
      <Modal show={show} onHide={modalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Post</Modal.Title>
        </Modal.Header>
        <Modal.Body className="popup-body">
          <input
            type="text"
            name="title"
            value={inputs.title}
            onChange={handleInputChange}
            className="input-text form-control mb-3"
            placeholder="title"
          />
          <textarea
            type="text"
            value={inputs.content}
            name="content"
            onChange={handleInputChange}
            className="input-text form-control mb-3"
            placeholder="content"
          />
          <input
            type="file"
            name="images"
            onChange={handleInputChange}
            className="form-control"
            multiple
          />
          <label>Select a project(optional):</label>
          <select
            id="dropdown"
            name="project"
            value={inputs.project}
            onChange={handleInputChange}
          >
            <option value="">Select a project</option>
            {project?.map((item) => (
              <option key={item.idProject} value={item.idProject}>
                {item.name}
              </option>
            ))}
          </select>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={modalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreatePost}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PostPu;
