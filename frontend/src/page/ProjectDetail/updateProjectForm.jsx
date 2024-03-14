import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import { FiEdit } from "react-icons/fi";
import "./UPF.scss";
import { useRef } from "react";
import TempImg from "../../images/project/Pro-3.png";
import { IoCameraReverse } from "react-icons/io5";

function UpdateProjectForm() {
  const [show, setShow] = useState(false);
  const modalClose = () => setShow(false);
  const modalShow = () => setShow(true);
  const handleClick = () => {
    fileInputRef.current.click();
  };
  const fileInputRef = useRef(null);
  const projectStatus = (process) => {
    switch (process) {
      case 0:
        return <div className="status preparing">Preparing</div>;
      case 1:
        return <div className="status process">Process</div>;
      case 2:
        return <div className="status done">Done</div>;
      case 3:
        return <div className="status pending">Pending</div>;
      default:
      // code block
    }
  };
  const projectVisibility = (visibility) => {
    switch (visibility) {
      case 0:
        return <div className="visibility private">Private</div>;
      case 1:
        return <div className="visibility public">Public</div>;
      case 2:
        return <div className="visibility hidden">Hidden</div>;

      default:
      // code block
    }
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
              <img src={TempImg} alt="img" />
              <IoCameraReverse
                className="update-img-btn"
                onClick={handleClick}
              />
            </div>
            <div className="col-6">
              <div className="form-row name">
                <label>Project Name</label>
                <textarea
                  name=""
                  id=""
                  className="form-control d-h-2"
                ></textarea>
              </div>
              <div className="status-block size-18">
                <label htmlFor="" className="">
                  Project Status:
                  {/* {projectStatus(data?.process)} */}
                  <select
                    id="projectStatus"
                    className="status-select status preparing"
                  >
                    <option value="preparing" className="status preparing">
                      Preparing
                    </option>
                    <option value="process" className="status process">
                      Process
                    </option>
                    <option value="pending" className="status pending">
                      Pending
                    </option>
                    <option value="done" className="status done">
                      Done
                    </option>
                  </select>
                </label>
              </div>
              <div className="status-block size-18">
                <label htmlFor="" className="">
                  Access Visibility:
                  {/* {projectVisibility(data?.visibility)} */}
                  {}
                  <select
                    id="accessVisibility"
                    className="visibility-select visibility public"
                  >
                    <option value="public" className="visibility public">
                      Public
                    </option>
                    <option value="private" className="visibility private">
                      Private
                    </option>
                    <option value="hidden" className="visibility hidden">
                      Hidden
                    </option>
                  </select>
                </label>
              </div>
              <div className="form-row description">
                <label>Project Description</label>
                <textarea
                  name=""
                  id=""
                  className="form-control m-h-2"
                ></textarea>
              </div>
            </div>{" "}
            <input
              type="file"
              name="images"
              // onChange={handleInputChange}
              className="form-control"
              multiple
              ref={fileInputRef}
              style={{ display: "none" }} // Hide the input
            />
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="warning" onClick={modalClose}>
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
