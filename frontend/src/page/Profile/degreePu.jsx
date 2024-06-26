import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import "./profile.scss";
import { credentialInstance } from "../../axios/axiosConfig";
import Notification, { notifySuccess, notifyError } from "../../../src/components/notification";

function DegreePu({ ...props }) {
  const { user, resetTab } = props;
  const [show, setShow] = useState(false);
  const [inputs, setInputs] = useState({
    name: "",
    institution: "",
    file: "",
    FileFile: null,
    FileSrc: "",
  });
  const handleInputChange = (event) => {
    const { name, value, type } = event.target;
    if (type === "file") {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (x) => {
        setInputs((prevInputs) => ({
          ...prevInputs,
          file: file.name,
          FileFile: file,
          FileSrc: x.target.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setInputs((prevInputs) => ({ ...prevInputs, [name]: value }));
    }
  };
  const modalClose = () => setShow(false);
  const modalShow = () => setShow(true);
  const modelSubmit = () => {
    const formData = new FormData();
    formData.append("name", inputs.name);
    formData.append("institution", inputs.institution);
    formData.append("file", inputs.file);
    formData.append("FileFile", inputs.FileFile);
    for (let pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    credentialInstance
      .post(`/CreateDegree/${user}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          accept: "application/json",
        },
      })
      .then((res) => {
        resetTab();
        setInputs({
          name: "",
          institution: "",
          file: "",
          FileFile: null,
        });
        notifySuccess("Create degree is success!");

      })
      .catch((error) => {
        console.error(error);
        notifyError("Create degree is fail!");
      });
    setShow(false);
  };
  return (
    <div>
      <Button variant="m-0 btn btn-primary me-2" onClick={modalShow}>
        Add Degree
      </Button>
      <Modal show={show} onHide={modalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Degree</Modal.Title>
        </Modal.Header>
        <Modal.Body className="popup-body">
          <input
            type="text"
            name="name"
            value={inputs.name}
            onChange={handleInputChange}
            className="input-text form-control mb-3"
            placeholder="Name"
          />
          <input
            type="text"
            value={inputs.institution}
            name="institution"
            onChange={handleInputChange}
            className="input-text form-control mb-3"
            placeholder="Institution"
          />
          <input
            type="file"
            name="file"
            onChange={handleInputChange}
            className="form-control file-custom"
          />
          {/* Display the selected file */}
          {inputs.FileFile && (
            <div className="mt-2">
              {inputs.FileSrc.startsWith("data:image") ? ( // Check if the file is an image
                <img
                  src={inputs.FileSrc}
                  alt="Selected File"
                  style={{ maxWidth: "100%", maxHeight: "200px" }}
                />
              ) : (
                <a
                  href={inputs.FileFile}
                  download={inputs.file}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download File
                </a>
              )}
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={modalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={modelSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default DegreePu;
