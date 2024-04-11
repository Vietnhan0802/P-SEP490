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
import Notification, { notifySuccess, notifyError } from "../../../src/components/notification";
import { useForm } from 'react-hook-form';
function UpdateInformationPu({ value, id, reset, show, onClose, handleChangeImg }) {
  const [user, setUser] = useState({});

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm();
  const modalClose = () => onClose();

  useEffect(() => {
    setValue('fullName', value?.fullName, { shouldValidate: true })
    setValue('date', value?.date, { shouldValidate: true })
    setValue('phoneNumber', value?.phoneNumber, { shouldValidate: true })
    setValue('address', value?.address, { shouldValidate: true })
    setValue('tax', value?.tax, { shouldValidate: true })
    setValue('description', value?.description)
    setUser({
      userName: value?.userName,
      isMale: value?.isMale,
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
  const modelSubmit = handleSubmit((data) => {
    console.log(data)
    userInstance.put(`UpdateUser/${id}`, {
      userName: user.userName,
      fullName: data.fullName,
      date: data.date,
      isMale: user.isMale,
      phoneNumber: data.phoneNumber,
      tax: data.tax,
      address: data.address,
      description: data.description
    })
      .then((res) => {
        handleChangeImg('ok');
        reset(!show);
        notifySuccess("Update information is success!");
      })
      .catch((error) => { console.error(error); notifyError("Update information is fail!"); })
    modalClose();
  });
  const handlePositionChange = (selectedOption) => {
    setUser(prevState => ({
      ...prevState,
      isMale: selectedOption.value
    }));
  };
  return (
    <div>
      <Modal show={show} onHide={modalClose} id="update-infomation">
        <Modal.Header closeButton>
          <Modal.Title>Update Information</Modal.Title>
        </Modal.Header>
        <Modal.Body className="popup-body report-popup " id="report-body">
          <form>
            <label className="mt-2">Full Name:</label>
            <input
              type="text"
              className="form-control input-custom"
              // name="fullName"
              // value={user?.fullName}
              // onChange={handleChange}
              {...register('fullName', {
                required: 'Full name is required',
                validate: (value) => {

                }
                , pattern: {
                  value: /^\D*$/,
                  message: 'Full name can not contain number',
                },
              })}
              aria-label="Full name"
              required
            />

            <p className="text-danger">
              {errors.fullName && errors.fullName.message}
            </p>
            <label className="mt-2">
              {user?.role === "Business" ? "Establish date" : "Birthday"}
            </label>
            <input
              {...register('date', {
                required: 'Date is required',
                validate: (value) => {

                }
              })}
              type="date"
              className="form-control input-custom" />
            <p
              className="text-danger">
              {errors.date && errors.date.message}
            </p>
            <label className="mt-2">Phone number</label>
            <input
              type="number"
              name="phoneNumber"
              {...register('phoneNumber', {
                required: 'Phone number is required',
                validate: (value) => {

                }, pattern: {
                  value: /^0\d{9}$/,
                  message: 'Phone number start with 0 and has to have 10 number',
                },
              })}
              className="form-control input-custom"
              aria-label="Phone number"
              required
            />
            <p className="text-danger">
              {errors.phoneNumber && errors.phoneNumber.message}
            </p>
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

                </div>
              </div>
            )}
            <label className="mt-2">Address:</label>
            <input
              type="text"
              name="address"
              className="form-control input-custom"
              {...register('address', {
                required: 'Address is required',
                validate: (value) => {

                }
              })}
              aria-label="Address"
              required
            />
            <p className="text-danger">
              {errors.address && errors.address.message}
            </p>
            <label className="mt-2 ">Tax:</label>
            <input
              type="number"
              name="tax"
              className="form-control input-custom"
              {...register('tax', {
                required: 'Tax is required',
                validate: (value) => {

                }, pattern: {
                  value: /^\d{10}$/,
                  message: 'Tax number has to be 10 digit',
                },
              })}
              aria-label="Tax"
              required
            />
            <p className="text-danger">
              {errors.tax && errors.tax.message}
            </p>
            <label className="mt-2">Description:</label>
            <textarea
              type="text"
              name="description"
              {...register('description', {
              })}
              placeholder="Hope you will give us some description about yourselves"
              style={{ maxHeight: '200px' }}
              className="form-control input-custom"
              aria-label="Description"
            />
            <p className="text-danger">
              {errors.description && errors.description.message}
            </p>
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
