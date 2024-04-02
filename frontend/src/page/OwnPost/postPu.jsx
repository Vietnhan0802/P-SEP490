import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import React, { useEffect } from "react";
import "./post-pu.scss";
import Select from 'react-select';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Notification, {
  notifySuccess,
  notifyError,
} from "../../components/notification";
import {
  postInstance,
  projectInstance,
  reportInstance,
} from "../../axios/axiosConfig";

function PostPu({ reset }) {
  const [show, setShow] = useState(false);
  const [project, setProject] = useState();
  const modalClose = () => setShow(false);
  const modalShow = () => setShow(true);
  const [resetPage, setResetPage] = useState(false);
  const sessionData = JSON.parse(sessionStorage.getItem("userSession")) || {};
  const { currentUserId } = sessionData;
  const [inputs, setInputs] = useState({
    title: "",
    content: "",
    CreateUpdatePostImages: [], // new state for managing multiple images
    project: "",
  });
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
  useEffect(() => {
    projectInstance
      .get("GetAllProjects")
      .then((res) => {
        const projectList = res?.data?.result;
        const options = projectList.map((item) => ({
          value: item.idProject,
          label: item.name,
        }));
        setProject(options);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  const handleSelctProject = (selectedOption) => {
    setInputs(prevState => ({
      ...prevState,
      project: selectedOption.value
    }));
  }
  const handleCreatePost = () => {
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

    postInstance.post(`/CreatePost/${currentUserId}?idProject=${inputs.project}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        accept: "application/json",
      },
    })
      .then((res) => {
        reset(!resetPage);
        setInputs({
          title: "",
          content: "",
          CreateUpdatePostImages: [], // new state for managing multiple images
          project: "",
        });
        notifySuccess("Create post successfully!");
        setShow(false);
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
  const handleContentChange = (newValue) => {
    setInputs((prev) => ({ ...prev, content: newValue }));
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
      <Modal show={show} onHide={modalClose} id='postPu'>
        <Modal.Header closeButton>
          <Modal.Title>Create Post</Modal.Title>
        </Modal.Header>
        <Modal.Body className="popup-body">
          <div className='form-floating mb-3'>
            <input
              type="text"
              name="title"
              value={inputs.title}
              onChange={handleInputChange}
              className="input-text form-control mb-3"
              placeholder=""
            />
            <label for="floatingInput">Post Title</label>
          </div>
          <ReactQuill
          theme="snow"
          value={inputs.content}
          onChange={handleContentChange}
          modules={modules}
          formats={formats}
          className="mb-3"
        />
          <Select
            placeholder="Select a project (optional)"
            className="basic-single my-3"
            classNamePrefix="Select"
            isSearchable={false}
            name="color"
            options={project}
            onChange={handleSelctProject}
          />
          <div className="input-cover">
            <input
              type="file"
              name="images"
              onChange={handleInputChange}
              className="form-control"
              multiple
            />
          </div>

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
