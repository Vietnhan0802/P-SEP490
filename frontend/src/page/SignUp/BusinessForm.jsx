import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import userInstance from "../../axios/axiosConfig";
export default function BusinessForm() {
  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(inputs);
    try {
      const response = await userInstance.post("/SignUpForBusiness", inputs);
      console.log("Sign up successful", response.data);
      navigate("/");
    } catch (error) {
      console.error("Sign up failed", error.response.data);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="pb-2 d-flex flex-row align-items-center">
          <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1 ">Email</p>
          <input
            className="input-field rounded-50 w-100"
            placeholder="Enter your email"
            type="email"
            name="email"
            value={inputs.email || ""}
            onChange={handleChange}
          />
        </div>
        <div className="pb-2 d-flex flex-row align-items-center">
          <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1">
            Password
          </p>

          <input
            className="input-field rounded-50 w-100"
            placeholder="Enter your password"
            type="password"
            name="password"
            value={inputs.password || ""}
            onChange={handleChange}
          />
        </div>
        <div className="pb-2 d-flex flex-row align-items-center">
          <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1">
            FullName
          </p>
          <input
            className="input-field rounded-50 w-100"
            placeholder="Enter Business Name"
            type="text"
            name="fullName"
            value={inputs.fullName || ""}
            onChange={handleChange}
          />
        </div>
        <div className="pb-2 d-flex flex-row align-items-center">
          <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1">
            Establish Day
          </p>
          <input
            className="input-field rounded-50 w-100"
            placeholder="dd-mm-yyyy"
            min="1900-01-01"
            max="2023-12-31"
            type="date"
            name="birthday"
            value={inputs.birthday || ""}
            onChange={handleChange}
          />
        </div>
        <div className="pb-2 d-flex flex-row align-items-center">
          <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1">Phone</p>
          <input
            className="input-field rounded-50 w-100"
            placeholder="Enter Phone Number"
            type="text"
            name="phone"
            value={inputs.phone || ""}
            onChange={handleChange}
          />
        </div>
        <div className="pb-2 d-flex flex-row align-items-center">
          <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1">Tax</p>
          <input
            className="input-field rounded-50 w-100"
            placeholder="Enter your Tax"
            type="text"
            name="tax"
            value={inputs.tax || ""}
            onChange={handleChange}
          />
        </div>
        <div className="pb-2 d-flex flex-row align-items-center">
          <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1">
            Address
          </p>
          <input
            className="input-field rounded-50 w-100"
            placeholder="Enter your Address"
            type="text"
            name="address"
            value={inputs.address || ""}
            onChange={handleChange}
          />
        </div>
        <input
          className="submit-btn rounded-50 size-20 white SFU-bold w-100"
          type="submit"
          value="Sign up for Business"
        />
      </form>
    </div>
  );
}
