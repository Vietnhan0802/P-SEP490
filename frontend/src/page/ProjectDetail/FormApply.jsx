import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import "./form-member.scss";
import Select from 'react-select'
import { BsSendPlus } from "react-icons/bs";
import { projectInstance } from "../../axios/axiosConfig";
import { notifyError, notifySuccess } from "../../components/notification";
function FormApply({ projectId, positionOption }) {
  const sessionData = JSON.parse(sessionStorage.getItem('userSession')) || {};
  const { currentUserId } = sessionData;
  const optionsList = positionOption?.map((item) => {
    return {
      value: item.idPosition,
      label: item.namePosition
    }
  });
  const [invite, setInvite] = useState({
    idProject: projectId,
    userId: currentUserId,
    positionId: '',
    file: null,
    fileName: ''
  });
  const [show, setShow] = useState(false);

  const modalClose = () => setShow(false);
  const modalShow = () => setShow(true);
  const handlePositionChange = (selectedOption) => {
    setInvite(prevState => ({
      ...prevState,
      positionId: selectedOption.value
    }));
  };
  const handleInputChange = (event) => {
    const file = event.target.files[0];
    setInvite((prevInputs) => ({
      ...prevInputs,
      fileName: file.name,
      file: file
    }));

  };
  const handleApply = () => {
    // Example POST request with invite information
    const postData = {
      idProject: invite.idProject,
      userId: invite.userId,
      positionId: invite.positionId,
      cvUrl: invite.fileName,
      cvUrlFile: invite.file
    };
    console.log()
    const form = new FormData();
    form.append("idPosition", postData.positionId);
    form.append("cvUrl", postData.cvUrl);
    form.append("cvUrlFile", postData.cvUrlFile);

    projectInstance.post(`CreateProjectApplication/${postData.userId}/${postData.idProject}`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
        accept: "application/json",
      },
    })
      .then((res) => {
        console.log(res?.data?.result); setShow(false);
        if (res?.data?.status === 'BadRequest') {
          notifyError('You have applied for this project')
        } else {
          notifySuccess(res?.data?.result)
        }
      })
      .catch((error) => { console.error(error); notifyError("Send apply is fail!"); });
  };
  return (
    <div className="p-1">
      <Button variant="" onClick={modalShow}>
        <div className="d-flex align-items-center add-member">
          <BsSendPlus className="pe-2 fs-3" />
          <p>Send Apply</p>
        </div>
      </Button>
      <Modal show={show} onHide={modalClose}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>

        <Modal.Body className="popup-body" id="member-apply">
          <div className="confirmation-box">
            <h2>Are you sure you want to apply for this project?</h2>
            <p className="mb-2">(Upload your CV to Continue )</p>
            <input
              type="file"
              name="file"
              onChange={handleInputChange}
              accept=".pdf,.doc,.docx"
              className="form-control"
              required
            />
            <br />
            <Select
              options={optionsList}
              onChange={(selectedOption) => handlePositionChange(selectedOption)}
            />
            <button onClick={handleApply} className="mt-3">Confirm</button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
export default FormApply;
