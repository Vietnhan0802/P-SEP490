import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import React, { useEffect } from "react";
import "./blog-pu.scss";
import Notification, {
  notifySuccess,
  notifyError,
} from "../../components/notification";
import { blogInstance } from "../../axios/axiosConfig";
function BlogPu({ resetBlog }) {
  const [show, setShow] = useState(false);

  const modalClose = () => setShow(false);
  const modalShow = () => setShow(true);
  const modelSubmit = () => setShow(false);
  const sessionData = JSON.parse(sessionStorage.getItem("userSession")) || {};
  const { role, currentUserId } = sessionData;
  const [reset, setReset] = useState(true);
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
          CreateUpdateBlogImages: [
            ...values.CreateUpdateBlogImages,
            ...convertedImages,
          ],
        }));
      });
    } else {
      setInputs((values) => ({ ...values, [name]: value }));
    }
  };
  const [inputs, setInputs] = useState({
    title: "",
    content: "",
    CreateUpdateBlogImages: [], // new state for managing multiple images
  });
  const handleCreateBlog = () => {
    const formData = new FormData();
    formData.append("title", inputs.title);
    formData.append("content", inputs.content);

    inputs.CreateUpdateBlogImages.forEach((imageInfo, index) => {
      formData.append(
        `CreateUpdateBlogImages[${index}].image`,
        imageInfo.image
      );
      formData.append(
        `CreateUpdateBlogImages[${index}].imageFile`,
        imageInfo.imageFile
      );
      formData.append(
        `CreateUpdateBlogImages[${index}].imageSrc`,
        imageInfo.imageSrc
      );
    });

    blogInstance.post(`/CreateBlog/${currentUserId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        accept: "application/json",
      },
    })
      .then((res) => {
        setInputs({
          title: "",
          content: "",
          CreateUpdateBlogImages: [], // new state for managing multiple images
        });
        notifySuccess("Create blog successfully!");
        resetBlog(!reset);
      })
      .catch((err) => {
        console.log(err);
        notifyError("Create blog failed!");
      });
    modelSubmit();
  };

  return (
    <div className="">
      <Button variant="m-0 btn btn-primary me-2" onClick={modalShow}>
        Create
      </Button>
      <Modal show={show} onHide={modalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body className="popup-body">
          <input
            type="text"
            name="title"
            value={inputs.title}
            onChange={handleInputChange}
            className="input-text form-control  mb-3"
            placeholder="Enter the title"
          />
          <input
            type="text"
            value={inputs.content}
            name="content"
            onChange={handleInputChange}
            className="input-text form-control  mb-3"
            placeholder="Enter your content..."
          />
          <input
            type="file"
            name="images"
            onChange={handleInputChange}
            className="form-control"
            multiple
          />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={modalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateBlog}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default BlogPu;
