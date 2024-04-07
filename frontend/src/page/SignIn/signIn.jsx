import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../SignIn/signIn.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userInstance } from "../../axios/axiosConfig";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import Notification, { notifySuccess, notifyError, notifyInfo, notifyWarn } from "../../components/notification";

export default function SignIn() {
  Cookies.remove('user');

  const [inputs, setInputs] = useState({});
  const navigate = useNavigate();
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await userInstance.post("/SignIn", JSON.stringify(inputs));
      if (response?.data?.status === "OK") {
        notifySuccess('Sign in successfully!');
        const decode = jwtDecode(response?.data?.result.token);
        sessionStorage.setItem('userSession', JSON.stringify({
          currentUserId: decode.Id,
          userName: decode.FullName,
          userEmail: decode.Email,
          token: response?.data?.result.token,
          role: response?.data?.result.role,
        }));
        // Broadcast the login event to other tabs
        const loginChannel = new BroadcastChannel('login_channel');
        loginChannel.postMessage({ action: 'login', userSession: { userId: decode.Id, role: response?.data?.result.role } });
        navigate("/post", { state: { activeItem: 'post' } });
      } else if (response?.data?.message === "Invalid input attempt!") {
        notifyWarn('Invalid input, please check again!');
      } else if (response?.data?.message === "User has been blocked!") {
        notifyWarn('Your account has been locked!');
      } else if (response?.data?.message === "Please confirm your email before logging in!") {
        notifyWarn('Please confirm your email before sign in!');
      } else {
        notifyError('Sign in failed!');
      }
    } catch (error) {
      console.error("Error during sign in:", error);
    }
  };

  const handleClickGG = async (googleResponse) => {
    try {
      console.log("Google login response:", googleResponse);
      const { credential } = googleResponse;
      const decodedGG = jwtDecode(credential); // Assuming the JWT format response

      // Implement your logic for successful Google login here.
      // For demonstration, let's just log the decoded JWT
      console.log("Decoded JWT from Google:", decodedGG);
      const email = decodedGG.email; // Might have been 'email' instead of 'Email'
      const fullName = decodedGG.name; // Might have been 'name' instead of 'FullName'

      console.log(email, fullName);

      const apiResponse = await userInstance.post(`/SignInGoogle/${email}`);
      if (apiResponse?.data?.status === "OK") {
        notifySuccess('Sign in successfully!');
        const decodeJwt = jwtDecode(apiResponse?.data?.result.token);
        sessionStorage.setItem('userSession', JSON.stringify({
          currentUserId: decodeJwt.Id,
          userName: decodeJwt.FullName,
          userEmail: decodeJwt.Email,
          token: apiResponse?.data?.result.token,
          role: apiResponse?.data?.result.role,
        }));
        // Broadcast the login event to other tabs
        const loginChannel = new BroadcastChannel('login_channel');
        loginChannel.postMessage({ action: 'login', userSession: { userId: decodeJwt.Id, role: apiResponse?.data?.result.role } });
        navigate("/post", { state: { activeItem: 'post' } });
      } else {
        notifyError('Sign in failed!');
      }
    } catch (error) {
      console.error("Error during sign in:", error);
    }
  };

  const errorMessage = (error) => {
    console.error("Google login error:", error);
  };


  return (
    <section
      id="signInForm"
      className="signIn-bg hV-100 d-flex align-items-center"
    >
      <div className="container">
        <div className="d-flex m-auto mw-40" style={{ maxHeight: '90vh' }}>
          <div className="col-12 m-auto bg-white pt-sm-5 pb-md-5 signin px-lg-5 px-sm-3 w-100" >
            <p className="SFU-bold size-40 blue2f text-center py-lg-3 py-lg-5 fs-xs-30">
              SIGN IN
            </p>
            <div className="form-area">
              <form onSubmit={handleSubmit}>
                <div className="pb-2">
                  <p className="size-20 blue2f SFU-heavy indent-30 pb-1">
                    Email *
                  </p>
                  <input
                    required
                    className="input-field rounded-50 w-100"
                    placeholder="Enter your email address"
                    type="email"
                    name="email"
                    value={inputs.email || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="pb-2">
                  <p className="size-20 blue2f SFU-heavy indent-30 pb-1">
                    Password *
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
                </div>
                <div className="d-flex justify-content-end">
                  <a className="un-decor SFU-book blue55 size-20 pb-2" href="/forgetpassword">
                    Forg0t password?
                  </a>
                </div>
                <input
                  className="submit-btn rounded-50 size-20 white SFU-bold w-100"
                  type="submit"
                  value="Sign in"
                />
              </form>
              <div className="d-flex justify-content-center">
                <a
                  className="un-decor SFU-book green14 size-20 pt-1 pb-1"
                  href="/signup"
                >
                  Don’t have an account?
                </a>
              </div>
              <div className="row justify-content-center align-items-center ">
                <div className="col line1"></div>
                <div className="col-5 col-lg-4 col-md-4 col-sm-4 text-center size-20">
                  Sign in with
                </div>
                <div className="col line1"></div>
              </div>
              <div className="d-flex flex-row pt-3 pb-3">
                <div className="d-flex col-12 google-btn justify-content-center">
                  <GoogleLogin onSuccess={handleClickGG} onError={errorMessage} />

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
