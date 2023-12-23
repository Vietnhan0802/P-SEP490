import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logoImg from "../images/common/logo.png";
import GGIcon from "../images/common/gg-icon.png";
import FBIcon from "../images/common/fb-icon.png";
import "../css/signIn.css";

import { useState } from "react";
import ReactDOM from "react-dom/client";

export default function SignIn() {
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
        <div className="row form-shadow roundedL-28 roundedR-28">
          <div className="col-lg-7 roundedL-28 white-bg">
            <img src={logoImg} alt="logo" />
            <p className="SFU-bold size-40 blue2f text-center">SIGN IN</p>
            <div className="form-area">
              <form onSubmit={handleSubmit}>
                <div>
                  <p className="size-20 blue2f SFU-heavy indent-30">Email *</p>
                  <input
                    className="input-field rounded-50 w-100"
                    placeholder="Enter your email address"
                    type="email"
                    name="username"
                    value={inputs.username || ""}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <p className="size-20 blue2f SFU-heavy indent-30">
                    Password *
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
                <div className="d-flex justify-content-end">
                  <a className="un-decor SFU-book blue55 size-20" href="#">
                    Fogot password?
                  </a>
                </div>
                <input
                  className="submit-btn rounded-50 size-20 white SFU-bold w-100"
                  type="submit"
                  value="Sign in"
                />
              </form>
              <div className="d-flex justify-content-center">
                <a className="un-decor SFU-book green14 size-20" href="#">
                  Don’t have an account?
                </a>
              </div>
              <div className="row justify-content-center align-items-center ">
                <div className="col line1"></div>
                <div className="col col-lg-4 text-center size-20">
                  Sign in with
                </div>
                <div className="col line1"></div>
              </div>
              <div className="d-flex flex-row">
                <div className="d-flex col-6 google-btn justify-content-end">
                  <button className="gray-border white-bg d-flex flex-row rounded-50 align-items-center justify-content-center" 
                    type="button" onClick={handleClickGG}>
                    <img src={GGIcon} alt="GGIcon" />
                    <p>Google</p>
                  </button>
                </div>
                <div className="d-flex col-6 facebook-btn">
                  <button className="gray-border white-bg d-flex flex-row rounded-50 align-items-center justify-content-center" 
                    type="button" onClick={handleClickFB}>
                    <img src={FBIcon} alt="FBIcon" />
                    <p>Facebook</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col roundedR-28 wc-bg SFU-reg white">Welcom</div>
        </div>
      </div>
    </section>
  );
}
