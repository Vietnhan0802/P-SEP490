import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logoImg from "../images/common/logo.png";
import GGIcon from "../images/common/gg-icon.png";
import FBIcon from "../images/common/fb-icon.png";
import "../css/signIn.css";
import "../css/signUp.css";

import { useState } from "react";
import ReactDOM from "react-dom/client";

export default function SignIn() {
  const [showForm1, setShowForm1] = useState(true);
  const [showForm2, setShowForm2] = useState(false);

  const handleFormClick = (formNumber) => {
    // Reset the visibility of both forms
    setShowForm1(false);
    setShowForm2(false);

    // Set the visibility of the clicked form
    if (formNumber === 1) {
      setShowForm1(true);
    } else if (formNumber === 2) {
      setShowForm2(true);
    }
  };
  const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputs);
  };

  const handleClickGG = () => {
    // implementation details
  };
  const handleClickFB = () => {
    // implementation details
  };

  return (
    <section
      id="signInForm"
      className="signIn-bg hV-100 d-flex align-items-center"
    >
      <div className="container">
        <div className="d-flex form-shadow roundedL-28 roundedR-28 flex-column-reverse flex-lg-row">
          <div className="col-lg-7 col roundedL-28 white-bg pt-2 pb-4">
            <p className="SFU-bold size-40 blue2f text-center py-lg-3 py-lg-5">
              SIGN UP
            </p>
            <div className="d-flex justify-content-between">
            <button onClick={() => handleFormClick(1)} className="gray-border white-bg d-flex flex-row rounded-50 align-items-center justify-content-center">Person</button>
            <button onClick={() => handleFormClick(2)} className="gray-border white-bg d-flex flex-row rounded-50 align-items-center justify-content-center">Business</button>
           
            </div>
             <div className="form-area">
              {showForm1 && (
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
                      value={inputs.email || ""}
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
                      value={inputs.password || ""}
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
                      value={inputs.fullName || ""}
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
                      value={inputs.birthday || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="d-flex flex-row justify-content-evenly">
                    <div className="pb-2 d-flex flex-row align-items-center">
                      <p className="size-20 blue2f SFU-heavy pb-1 input-field">
                        Male
                      </p>
                      <input
                        className="radius-size"
                        type="radio"
                        name="isMale"
                        value="1"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="pb-2 d-flex flex-row align-items-center">
                      <p className="size-20 blue2f SFU-heavy pb-1 input-field">
                        Female
                      </p>
                      <input
                        className="radius-size"
                        type="radio"
                        name="isMale"
                        value="0"
                        onChange={handleChange}
                      />
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
                      value={inputs.phone || ""}
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
                      value={inputs.tax || ""}
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
                      value={inputs.address || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <input
                    className="submit-btn rounded-50 size-20 white SFU-bold w-100"
                    type="submit"
                    value="Sign up for Person"
                  />
                </form>
              )}
              {showForm2 && (
                <form onSubmit={handleSubmit}>
                  <div className="pb-2 d-flex flex-row align-items-center">
                    <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1 ">
                      Email
                    </p>
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
                    <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1">
                      Phone
                    </p>
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
                    <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1">
                      Tax
                    </p>
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
              )}
              <div className="row justify-content-center align-items-center pt-2">
                <div className="col line1"></div>
                <div className="col-5 col-lg-4 col-md-4 col-sm-4 text-center size-20">
                  Sign up with
                </div>
                <div className="col line1"></div>
              </div>
              <div className="d-flex flex-row pt-3 pb-3">
                <div className="d-flex col-6 google-btn justify-content-end">
                  <button
                    className="gray-border white-bg d-flex flex-row rounded-50 align-items-center justify-content-center"
                    type="button"
                    onClick={handleClickGG}
                  >
                    <img src={GGIcon} alt="GGIcon" />
                    <p>Google</p>
                  </button>
                </div>
                <div className="d-flex col-6 facebook-btn">
                  <button
                    className="gray-border white-bg d-flex flex-row rounded-50 align-items-center justify-content-center"
                    type="button"
                    onClick={handleClickFB}
                  >
                    <img src={FBIcon} alt="FBIcon" />
                    <p>Facebook</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col roundedR-28 wc-bg SFU-reg white">
            <div className="d-flex justify-content-center justify-content-lg-start">
              <img className="pt-4 px-lg-3 pb-lg-5" src={logoImg} alt="logo" />
            </div>
            <div className="SFU-bold px-4 pb-3 pt-lg-5 mt-lg-5 text-center text-lg-start ">
              <p className="size-40 d-lg-none">Welcome Back!</p>
              <p className="d-none d-lg-block size-70">
                Welcome&nbsp;
                <br />
                Back!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
