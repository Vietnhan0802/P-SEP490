import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import logoImg from "../../images/common/logo.png";
import GGIcon from "../../images/common/gg-icon.png";
import FBIcon from "../../images/common/fb-icon.png";
import "../SignIn/signIn.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userInstance } from "../../axios/axiosConfig";
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import Notification, { notifySuccess, notifyError } from "../../components/notification";
import { GoogleLogin } from '@react-oauth/google';

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
      } else {
        notifyError('Sign in failed!');
      }
    } catch (error) {
      console.error("Error during sign in:", error);
    }
  };

  const handleLoginSuccess = (credentialResponse) => {
    console.log(credentialResponse);
    notifySuccess('Google Sign in successfully!');
    // You should send credentialResponse.credential (JWT) to your backend for verification and further processing
    // navigate("/home"); or handle session setup here
  };

  const handleLoginFailure = () => {
    console.error('Google Sign in failed');
    notifyError('Google Sign in failed!');
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
          <div className="col-lg-7 col roundedL-28 white-bg pt-5 pb-5">
            <p className="SFU-bold size-40 blue2f text-center py-lg-3 py-lg-5">
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
                <div className="d-flex col-6 google-btn justify-content-end">
                <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onError={handleLoginFailure}
                  render={renderProps => (
                    <button
                      className="gray-border white-bg d-flex flex-row rounded-50 align-items-center justify-content-center"
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                    >
                      <img src={GGIcon} alt="Google sign-in" />
                      <p>Google</p>
                    </button>
                  )}
                />
                  {/* <button
                    className="gray-border white-bg d-flex flex-row rounded-50 align-items-center justify-content-center"
                    type="button"
                    onClick={handleClickGG}
                  >
                    <img src={GGIcon} alt="GGIcon" />
                    <p>Google</p>
                  </button> */}
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
