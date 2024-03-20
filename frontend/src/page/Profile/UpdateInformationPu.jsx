import { Modal, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import "../../components/report-popup/popup.scss";
import { FiEdit } from "react-icons/fi";
import { userInstance } from "../../axios/axiosConfig";
function UpdateInformationPu({ value, id, reset }) {
  const [user, setUser] = useState({
    userName: '',
    fullName: '',
    date: '',
    isMale: '',
    phoneNumber: '',
    tax: '',
    address: '',
    description: '', role: ''
  });

  const [show, setShow] = useState(false);

  const modalClose = () => setShow(false);
  const modalShow = () => {
    setUser({
      userName: value?.userName,
      fullName: value?.fullName,
      date: value?.date,
      isMale: value?.isMale,
      phoneNumber: value?.phoneNumber,
      tax: value?.tax,
      address: value?.address,
      description: value?.description,
      role: value.role
    });
    setShow(true);
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setUser((prevInputs) => ({
      ...prevInputs,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const modelSubmit = (event) => {
    userInstance.put(`UpdateUser/${id}`, {
      userName: user.userName,
      fullName: user.fullName,
      date: user.date,
      isMale: user.isMale,
      phoneNumber: user.phoneNumber,
      tax: user.tax,
      address: user.address,
      description: user.description
    })
      .then((res) => { reset(!show); })
      .catch((error) => { console.error(error) })
    modalClose();
  };

  return (
    <div className="p-1">
      <FiEdit onClick={modalShow} size={28} />

      <Modal show={show} onHide={modalClose} id="update-infomation">
        <Modal.Header closeButton>
          <Modal.Title>Update Information</Modal.Title>
        </Modal.Header>

        <Modal.Body className="popup-body report-popup " id="report-body">
          <label className="mt-2">Full Name:</label>
          <input
            type="text"
            className="form-control"
            name="fullName"
            value={user?.fullName}
            onChange={handleChange}
            aria-label="Full name"
          />

          <label className="mt-2">
            {user?.role === "Business" ? "Establish date" : "Birthday"}
          </label>
          <input
            type="date"
            name="date"
            value={user?.date}
            onChange={handleChange}
            className="form-control"
            aria-label="Birthday"
          />

          <label className="mt-2">Phone number</label>
          <input
            type="text"
            name="phoneNumber"
            value={user?.phoneNumber}
            onChange={handleChange}
            className="form-control"
            aria-label="Phone number"
          />
          {user.role !== "Business" && (
            <div>
              <label className="mt-2">Gender:</label>
              <div className="">

                <div className="checkbox-wrapper-13 bg-text">
                  <label>
                    <input
                      id="c1-13"
                      className="me-1"
                      type="checkbox"
                      checked={user?.isMale}
                      name="isMale"
                      onChange={() =>
                        handleChange({
                          target: { name: "isMale", value: true },
                        })
                      }
                    />
                    Male
                  </label>

                  <label className="ps-4">
                    <input
                      id="c1-13"
                      className="me-1"
                      type="checkbox"
                      checked={!user?.isMale}
                      name="isMale"
                      onChange={() =>
                        handleChange({
                          target: { name: "isMale", value: false },
                        })
                      }
                    />
                    Female
                  </label>
                </div>

              </div>
            </div>
          )}
          <label className="mt-2">Address:</label>
          <input
            type="text"
            name="address"
            className="form-control"
            value={user?.address}
            onChange={handleChange}
            aria-label="Address"
          />
          <label className="mt-2 ">Tax:</label>
          <input
            type="number"
            name="tax"
            className="form-control"
            value={user?.tax}
            onChange={handleChange}
            aria-label="Tax"
          />

          <label className="mt-2">Description:</label>
          <textarea
            type="text"
            name="description"
            value={user?.description || ""}
            placeholder="Hope you will give us some description about yourselves"
            onChange={handleChange}
            style={{ maxHeight: '200px' }}
            className="form-control"
            aria-label="Description"
          />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={modalClose}>
            Close
          </Button>
          <Button variant="warning" onClick={modelSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default UpdateInformationPu;
