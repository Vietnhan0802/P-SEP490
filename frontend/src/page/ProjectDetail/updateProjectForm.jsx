import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import "./UPF.scss";
import { useRef } from "react";
import { IoCameraReverse } from "react-icons/io5";
import CreatableSelect from 'react-select/creatable';
import makeAnimated from 'react-select/animated';
import { projectInstance } from "../../axios/axiosConfig";
import Notification, { notifySuccess, notifyError } from "../../../components/notification";
function UpdateProjectForm({ input, id, resetPage }) {

  const animatedComponents = makeAnimated();
  const [show, setShow] = useState(false);
  const [project, setProject] = useState({});
  const modalClose = () => { setChangeImage(false); setShow(false); };
  const [positionOptions, setPositionOptions] = useState([]);
  const [changeImage, setChangeImage] = useState(false);
  const modalShow = () => {
    setShow(true);
    const positionOptions = input.positionViews.map(item => ({
      value: item.namePosition,
      label: item.namePosition
    }));
    setPositionOptions(positionOptions);
    setProject({
      name: input.name,
      description: input.description,
      avatar: input.avatarSrc,
      visibility: input.visibility,
      process: input.process,
      namePosition: positionOptions,
      ImageFile: null,
      ImageSrc: ''
    });
  };
  const handleSelectChange = (selectedOptions) => {
    setProject(prevState => ({
      ...prevState,
      namePosition: selectedOptions || [] // Use selected options or fallback to an empty array
    }));
  };
  const handleClick = () => {
    fileInputRef.current.click();
  };
  const fileInputRef = useRef(null);
  const handleInputChange = (event) => {
    const { name, value, type } = event.target;
    if (type === "file") {
      setChangeImage(true);
      const file = event.target.files[0];

      // Use FileReader to convert each file to base64
      const base64String = readFileAsDataURL(file);

      setProject((values) => ({
        ...values,
        avatar: file.name,
        ImageFile: file,
        ImageSrc: base64String,

      }));
      showPreview(event);
    } else if (name === "namePosition") {
      // Handle change for Select component
      setProject((values) => ({
        ...values,
        [name]: value.map(option => option.value) // Store only values of selected options
      }));
    } else if (name === 'process' || name === 'visibility') {
      setProject((values) => ({ ...values, [name]: parseInt(value) }));
    } else {
      setProject((values) => ({ ...values, [name]: value }));

    }
  };
  const showPreview = (e) => {
    if (e.target.files && e.target.files[0]) {
      let imageFile = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (x) => {
        setProject({
          ...project,
          avatar: imageFile.name,
          ImageFile: imageFile,
          ImageSrc: x.target.result,
        });
      };
      reader.readAsDataURL(imageFile);
    } else {
      setProject({
        ...project,
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

  const handleUpdateProject = () => {

    const formData = new FormData();
    formData.append("name", project.name);
    formData.append("description", project.description);
    formData.append("process", parseInt(project.process));
    formData.append("visibility", parseInt(project.visibility));
    // Check if ImageFile is null before appending it to formData
    if (project.ImageFile) {
      formData.append("avatar", project.avatar); // Keep this if you want to send the avatar name
      formData.append("ImageFile", project.ImageFile);
    } else {
      // If ImageFile is null, explicitly set avatar to null in the formData
      // This depends on your backend's handling. If it expects an 'avatar' field even when null, uncomment the next line.
      // formData.append("avatar", null);
      // You might not need to append a null ImageFile, depending on how your backend handles absent fields.
    }
    project.namePosition.forEach((position, index) => {
      formData.append(
        `namePosition[${index}]`,
        position.value
      );
    });
    projectInstance.put(`/UpdateProject/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        accept: "application/json",
      },
    }).then(() => {
      resetPage("Success");
      setProject({
        name: '',
        description: '',
        avatar: '',
        visibility: 1,
        process: 1,
        namePosition: [],
        ImageFile: '',
        ImageSrc: ''
      });
      setShow(false);
      notifySuccess("Update project is success!");
    })
    .catch((error) => { notifyError("Update project is fail!"); })
  };
  return (
    <div className="p-1 ">
      <FiEdit onClick={modalShow} id="btn-update-project" />
      <Modal show={show} onHide={modalClose} id="cus-w">
        <Modal.Header closeButton>
          <Modal.Title>Update Project</Modal.Title>
        </Modal.Header>

        <Modal.Body className="popup-body" id="form-update-project">
          <div className="row">
            <div className="col-6 image-container d-flex justify-content-center pos-re">
              <img src={changeImage ? project.ImageSrc : project.avatar} alt="img" />
              <IoCameraReverse
                className="update-img-btn"
                onClick={handleClick}
              />
            </div>
            <div className="col-6">
              <div className="form-row name">
                <label>Project Name</label>
                <textarea
                  name="name"
                  className="form-control d-h-2"
                  value={project.name}
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div className="status-block size-18">
                <label htmlFor="" className="">
                  Project Status:
                  <select
                    value={project.process}
                    id="projectStatus"
                    name="process"
                    onChange={handleInputChange}
                    className="status-select status preparing"
                  >
                    <option value={0} className="status preparing">
                      Preparing
                    </option>
                    <option value={1} className="status process">
                      Process
                    </option>
                    <option value={2} className="status pending">
                      Pending
                    </option>
                    <option value={3} className="status done">
                      Done
                    </option>
                  </select>
                </label>
              </div>
    

              <div className="status-block size-18">
                <label htmlFor="" className="">
                  Access Visibility:
                  <select
                    name="visibility"
                    value={project.visibility}
                    id="accessVisibility"
                    className="visibility-select visibility public"
                    onChange={handleInputChange}
                  >
                    <option value={0} className="visibility private">
                      Private
                    </option>
                    <option value={1} className="visibility public">
                      Public
                    </option>
                    <option value={2} className="visibility hidden">
                      Hidden
                    </option>
                  </select>
                </label>
              </div>
              <div className="d-flex align-items-center">
                <label htmlFor="">Position: </label>
                <CreatableSelect
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  placeholder='Select all position needed in project'
                  isMulti
                  isClearable
                  options={positionOptions}
                  onChange={handleSelectChange} // Call handleSelectChange on change
                  value={project.namePosition} // Pass selected options as value
                />
              </div>
              <div className="form-row description">
                <label>Project Description</label>
                <textarea
                  name="description"
                  id=""
                  className="form-control m-h-2"
                  value={project.description}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>{" "}
            <input
              type="file"
              name="images"
              onChange={handleInputChange}
              className="form-control"
              ref={fileInputRef}
              style={{ display: "none" }} // Hide the input
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="warning" onClick={handleUpdateProject}>
            Confirm
          </Button>
          <Button variant="secondary" onClick={modalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default UpdateProjectForm;
