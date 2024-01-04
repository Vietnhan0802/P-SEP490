import React from "react";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
export default function PersonForm() {
  // const [inputs, setInputs] = useState({});
  const { instance } = require("../../axios/axiosConfig");
  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   console.log(inputs);
  //   try {
  //     const response = await instance
  //       .post("/SignUpForPerson", inputs)
  //       .then((res) => {
  //         console.log(res.data);
  //       });
  //     console.log(1);

  //     console.log("Sign up successful", response.data);
  //   } catch (error) {
  //     console.error(
  //       "Sign up failed",
  //       error.response ? error.response.data : error.message
  //     );
  //   }
  // };
  // const handleChange = (event) => {
  //   const name = event.target.name;
  //   const value = event.target.value;
  //   setInputs((values) => ({ ...values, [name]: value }));
  // };
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

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputs); // You can perform further actions, such as making an API request, with the 'inputs' data.
    try {
      const response =  instance
        .post("SignUpForPerson", inputs)
        .then((res) => {
          console.log(res.data);
        });
      console.log("Sign up successful", response.data);
    } catch (error) {
      console.error(
        "Sign up failed",error.response.data
      );
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  return (
    // <div>
    //   <form onSubmit={handleSubmit}>
    //     <div className="pb-2 d-flex flex-row align-items-center">
    //       <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1 input-field">
    //         Email
    //       </p>
    //       <input
    //         className="input-field rounded-50 w-100"
    //         placeholder="Enter your email"
    //         type="email"
    //         name="email"
    //         value={inputs.email || ""}
    //         onChange={handleChange}
    //       />
    //     </div>
    //     <div className="pb-2 d-flex flex-row align-items-center">
    //       <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1 input-field">
    //         Password
    //       </p>

    //       <input
    //         className="input-field rounded-50 w-100"
    //         placeholder="Enter your password"
    //         type="password"
    //         name="password"
    //         value={inputs.password || ""}
    //         onChange={handleChange}
    //       />
    //     </div>
    //     <div className="pb-2 d-flex flex-row align-items-center">
    //       <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1 input-field">
    //         FullName
    //       </p>
    //       <input
    //         className="input-field rounded-50 w-100"
    //         placeholder="Enter your FullName"
    //         type="text"
    //         name="fullName"
    //         value={inputs.fullName || ""}
    //         onChange={handleChange}
    //       />
    //     </div>
    //     <div className="pb-2 d-flex flex-row align-items-center">
    //       <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1 input-field">
    //         Birthday
    //       </p>
    //       <input
    //         className="input-field rounded-50 w-100"
    //         placeholder="dd-mm-yyyy"
    //         min="1900-01-01"
    //         max="2023-12-31"
    //         type="date"
    //         name="birthday"
    //         value={inputs.birthday || ""}
    //         onChange={handleChange}
    //       />
    //     </div>
    //     <div className="d-flex flex-row justify-content-evenly">
    //       <div className="pb-2 d-flex flex-row align-items-center">
    //         <p className="size-20 blue2f SFU-heavy pb-1 input-field">Male</p>
    //         <input
    //           className="radius-size"
    //           type="radio"
    //           name="isMale"
    //           value={false}
    //           onChange={handleChange}
    //         />
    //       </div>
    //       <div className="pb-2 d-flex flex-row align-items-center">
    //         <p className="size-20 blue2f SFU-heavy pb-1 input-field">Female</p>
    //         <input
    //           className="radius-size"
    //           type="radio"
    //           name="isMale"
    //           value={true}
    //           onChange={handleChange}
    //         />
    //       </div>
    //     </div>
    //     <div className="pb-2 d-flex flex-row align-items-center">
    //       <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1 input-field">
    //         Phone
    //       </p>
    //       <input
    //         className="input-field rounded-50 w-100"
    //         placeholder="Enter your Phone"
    //         type="text"
    //         name="phone"
    //         value={inputs.phone || ""}
    //         onChange={handleChange}
    //       />
    //     </div>
    //     <div className="pb-2 d-flex flex-row align-items-center">
    //       <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1 input-field">
    //         Tax
    //       </p>
    //       <input
    //         className="input-field rounded-50 w-100"
    //         placeholder="Enter your Tax"
    //         type="text"
    //         name="tax"
    //         value={inputs.tax || ""}
    //         onChange={handleChange}
    //       />
    //     </div>
    //     <div className="pb-2 d-flex flex-row align-items-center">
    //       <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1 input-field">
    //         Address
    //       </p>
    //       <input
    //         className="input-field rounded-50 w-100"
    //         placeholder="Enter your Address"
    //         type="text"
    //         name="address"
    //         value={inputs.address || ""}
    //         onChange={handleChange}
    //       />
    //     </div>
    //     <button
    //       className="submit-btn rounded-50 size-20 white SFU-bold w-100"
    //       type="submit"
    //       value="Sign up for Person"
    //     >
    //       Sign up
    //     </button>
    //   </form>
    // </div>
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={inputs.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={inputs.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Full Name:</label>
          <input
            type="text"
            name="fullName"
            value={inputs.fullName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Birthday:</label>
          <input
            type="date"
            name="birthday"
            value={inputs.birthday}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Gender:</label>
          <input
            type="checkbox"
            name="isMale"
            checked={inputs.isMale}
            onChange={handleChange}
          />{" "}
          Male
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            name="phone"
            value={inputs.phone}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Tax:</label>
          <input
            type="text"
            name="tax"
            value={inputs.tax}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={inputs.address}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
