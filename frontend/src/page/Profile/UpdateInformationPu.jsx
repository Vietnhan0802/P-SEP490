import { Modal, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import moment from 'moment';
import 'react-date-picker/dist/DatePicker.css';
import 'react-calendar/dist/Calendar.css';
import DatePicker from 'react-date-picker';
import "../../components/report-popup/popup.scss";
import "../Profile/check-box.scss";
import Select from 'react-select'
import { FiEdit } from "react-icons/fi";
import { userInstance } from "../../axios/axiosConfig";
function UpdateInformationPu({ value, id, reset, show, onClose, handleChangeImg }) {
  const [user, setUser] = useState({});


  const modalClose = () => onClose();

  useEffect(() => {
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
  }, [value]
  )
  const options = [
    { value: true, label: 'Male' },
    { value: false, label: 'Female' }
  ]
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
      .then((res) => {
        handleChangeImg('ok');
        reset(!show);
      })
      .catch((error) => { console.error(error) })
    modalClose();
  };
  const handlePositionChange = (selectedOption) => {
    setUser(prevState => ({
      ...prevState,
      isMale: selectedOption.value
    }));
  };
  return (
    <div className="p-1" id="">
      <Modal show={show} onHide={modalClose} id="update-infomation">
        <Modal.Header closeButton>
          <Modal.Title>Update Information</Modal.Title>
        </Modal.Header>
        <Modal.Body className="popup-body report-popup " id="report-body">
          <form>
            <label className="mt-2">Full Name:</label>
            <input
              type="text"
              className="form-control"
              name="fullName"
              value={user?.fullName}
              onChange={handleChange}
              aria-label="Full name"
              required
            />
            <label className="mt-2">
              {user?.role === "Business" ? "Establish date" : "Birthday"}
            </label>
            <DatePicker
              value={user?.date}
              onChange={(date) => { setUser((prev) => ({ ...prev, date: moment(date).format('YYYY-MM-DD') })) }}
              className="form-control" />
            <label className="mt-2">Phone number</label>
            <input
              type="text"
              name="phoneNumber"
              value={user?.phoneNumber}
              onChange={handleChange}
              className="form-control"
              aria-label="Phone number"
              required
            />

            {user.role !== "Business" && (
              <div>
                <label className="mt-2">Gender:</label>
                <div className="">
                  <Select
                    isSearchable={false}
                    defaultValue={user?.isMale ? options[0] : options[1]}
                    options={options}
                    onChange={(selectedOption) => handlePositionChange(selectedOption)}
                  />
                  {/* <div className="checkbox-wrapper-13 bg-text">
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
                </div> */}
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
              required
            />
            <label className="mt-2 ">Tax:</label>
            <input
              type="number"
              name="tax"
              className="form-control"
              value={user?.tax}
              onChange={handleChange}
              aria-label="Tax"
              required
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
          </form>

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
