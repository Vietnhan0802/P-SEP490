import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {userInstance} from "../../axios/axiosConfig";

import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function PersonForm() {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    fullName: "",
    birthday: "",
    isMale: true,
    phone: "",
    tax: "",
    address: "",
  });
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    const notifysuccess = (noti) => {
      toast.success(noti, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored"
      });
    }
    const notifyerror = (noti) => {
      toast.error(noti, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored"
      });
    }
    event.preventDefault();
    try {
      userInstance.post("/SignUpMember", inputs);
      console.log("Sign up successful");
      notifysuccess("Sign up for member successfully!");
      navigate("/");
    } catch (error) {
      console.error("Sign up failed", error.response.data);
      notifyerror("Sign up for member failed!");
    }
  };

  const handleChange = (event) => {
    console.log(event.target);
    const { name, value, type, checked } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="pb-2 d-flex flex-row align-items-center">
          <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1 input-field">
            Email
          </p>
          <input
            className="input-field rounded-50 w-100"
            placeholder="Enter your email"
            type="email"
            name="email"
            value={inputs.email}
            onChange={handleChange}
          />
        </div>
        <div className="pb-2 d-flex flex-row align-items-center">
          <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1 input-field">
            Password
          </p>
          <input
            className="input-field rounded-50 w-100"
            placeholder="Enter your password"
            type="password"
            name="password"
            value={inputs.password}
            onChange={handleChange}
          />
        </div>

        <div className="pb-2 d-flex flex-row align-items-center">
          <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1 input-field">
            FullName
          </p>
          <input
            className="input-field rounded-50 w-100"
            placeholder="Enter your FullName"
            type="text"
            name="fullName"
            value={inputs.fullName}
            onChange={handleChange}
          />
        </div>
        <div className="pb-2 d-flex flex-row align-items-center">
          <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1 input-field">
            Birthday
          </p>
          <input
            className="input-field rounded-50 w-100"
            placeholder="dd-mm-yyyy"
            min="1900-01-01"
            max="2023-12-31"
            type="date"
            name="birthday"
            value={inputs.birthday}
            onChange={handleChange}
          />
        </div>
        <div className="d-flex flex-row justify-content-evenly">
          <div className="pb-2 d-flex flex-row align-items-center">
            <label className="size-20 blue2f SFU-heavy pb-1 input-field d-flex align-items-center">
              <input
                className="radius-size me-3"
                type="radio"
                name="isMale"
                checked={inputs.isMale}
                onChange={() =>
                  handleChange({ target: { name: "isMale", value: true } })
                }
              />
              Male
            </label>

            <label className="size-20 blue2f SFU-heavy pb-1 input-field  d-flex align-items-center" >
              <input 
              className=" radius-size me-3"
                type="radio"
                name="isMale"
                checked={!inputs.isMale}
                onChange={() =>
                  handleChange({ target: { name: "isMale", value: false } })
                }
              />
              Female
            </label>
          </div>
        </div>
        <div className="pb-2 d-flex flex-row align-items-center">
          <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1 input-field">
            Phone
          </p>
          <input
            className="input-field rounded-50 w-100"
            placeholder="Enter your Phone"
            type="text"
            name="phone"
            value={inputs.phone}
            onChange={handleChange}
          />
        </div>
        <div className="pb-2 d-flex flex-row align-items-center">
          <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1 input-field">
            Tax
          </p>
          <input
            className="input-field rounded-50 w-100"
            placeholder="Enter your Tax"
            type="text"
            name="tax"
            value={inputs.tax}
            onChange={handleChange}
          />
        </div>
        <div className="pb-2 d-flex flex-row align-items-center">
          <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1 input-field">
            Address
          </p>
          <input
            className="input-field rounded-50 w-100"
            placeholder="Enter your Address"
            type="text"
            name="address"
            value={inputs.address}
            onChange={handleChange}
          />
        </div>
        <button
          className="submit-btn rounded-50 size-20 white SFU-bold w-100"
          type="submit"
          value="Sign up for Person"
        >
          Sign up
        </button>
      </form>
    </div>
  );
}
