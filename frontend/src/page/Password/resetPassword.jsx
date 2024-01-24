import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logoImg from "../../images/common/logo.png";
import "../SignIn/signIn.scss";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { userInstance } from "../../axios/axiosConfig";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
function ResetPassword() {
  const urlParams = new URLSearchParams(window.location.search);

  // Get the value of the 'token' parameter
  const token = urlParams.get('token');

  // Get the value of the 'email' parameter
  const email = urlParams.get('email');
  const newToken = decodeURIComponent(token);
  console.log(newToken)
  const [inputs, setInputs] = useState({
    password: "",
    confirmPassword: ""
  });
  const navigate = useNavigate();
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
    console.log(inputs);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(inputs);
    try {
      const response = await userInstance.post(
        "/ResetPassword", { password: inputs.password, confirmPassword: inputs.confirmPassword, email: email, token: newToken }
      );

      if (response?.data?.status === "OK") {
        console.log("Password Reset successfull", response?.data?.result.role);
        const decode = jwtDecode(response?.data?.result.token);

        // console.log(decode);
        // console.log(response?.data?.result?.role)
        Cookies.set("user", JSON.stringify(decode), { expires: 1 });
        Cookies.set("role", JSON.stringify(response?.data?.result.role), {
          expires: 1,
        });
        navigate("/home");
      } else {
        console.log(response.data);
        console.log(response?.data?.status);
        console.log("Sign in failed", response?.data?.status);
      }
    } catch (error) {
      // Check if it's an Axios error
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
      }
      console.log(error.config);
    }
  };
  return (
    <section
      id="signInForm"
      className="signIn-bg hV-100 d-flex align-items-center"
    >
      <div className="container">
        <div className="d-flex form-shadow roundedL-28 roundedR-28 flex-column-reverse flex-lg-row">
          <div className="col-lg-7 col roundedL-28 white-bg d-flex align-items-center">
            <div className="h-auto w-100">
              <p className="SFU-bold size-40 blue2f text-center mb-3">
                Reset Password
              </p>
              <div className="form-area">
                <form onSubmit={handleSubmit}>
                  <div className="pb-2">
                    <p className="size-20 blue2f SFU-heavy indent-30 pb-1">
                      Enter new password
                    </p>
                    <input
                      required
                      className="input-field rounded-50 w-100"
                      placeholder="Enter your password"
                      type="password"
                      name="password"
                      value={inputs.password || ""}
                      onChange={handleChange}
                    />
                  </div><div className="pb-2">
                    <p className="size-20 blue2f SFU-heavy indent-30 pb-1">
                      Confirm new password
                    </p>
                    <input
                      required
                      className="input-field rounded-50 w-100"
                      placeholder="Enter your password"
                      type="password"
                      name="confirmPassword"
                      value={inputs.confirmPassword || ""}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="d-flex justify-content-start my-3">
                    <a
                      className="un-decor SFU-book blue55 size-20 pb-2"
                      href="/"
                    >
                      Return to Sign in
                    </a>

                  </div>
                  <input
                    className="submit-btn rounded-50 size-20 white SFU-bold w-100"
                    type="submit"
                    value="Reset Password"
                  />
                </form>
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
                Reset&nbsp;
                <br />
                PassWord!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ResetPassword;
