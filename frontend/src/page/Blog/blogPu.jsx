import { Modal, Button } from "react-bootstrap";
import { useRef, useState } from "react";
import React, { useEffect } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "./blog-pu.scss";
import {
  notifySuccess,
  notifyError,
} from "../../components/notification";
import { blogInstance } from "../../axios/axiosConfig";
function BlogPu({ resetBlog }) {
  const quillRef = useRef(null);
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
  const quillInstance = quillRef.current?.getEditor();

    if (!quillInstance) {
      notifyError('Failed to get Quill instance');
      return;
    }
    const quillContents = quillInstance.getContents();

    // Validate the title
    if (!inputs.title.trim()) {
      notifyError('Please enter a title');
      return;
    }

    // Validate the content
    if (quillContents.ops.length === 1 && quillContents.ops[0].insert === '\n') {
      notifyError('Please enter some content');
      return;
    }
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
      resetBlog(); // Call resetBlog directly
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
    <Modal show={show} onHide={modalClose} id="blogPu">
      <Modal.Header closeButton>
        <Modal.Title>Create Blog</Modal.Title>
      </Modal.Header>
      <Modal.Body className="popup-body">
        <div class="form-floating mb-3">
          <input
            type="text"
            name="title"
            id="floatingInput"
            value={inputs.title}
            onChange={handleInputChange}
            className="input-text form-control  mb-3"
            placeholder="Enter the title"
          />
          <label htmlFor="floatingInput">Enter the title</label>
        </div>
        <ReactQuill
          theme="snow"
          value={inputs.content}
          onChange={handleContentChange}
          modules={modules}
          formats={formats}
          className="mb-3"
          ref={quillRef}
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
