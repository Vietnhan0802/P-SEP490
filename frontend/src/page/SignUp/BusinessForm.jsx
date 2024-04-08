import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userInstance } from "../../axios/axiosConfig";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import Notification, { notifySuccess, notifyError, notifyWarn } from "../../components/notification";

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
      const response = await userInstance.post("/SignUpBusiness", inputs);
      if (response?.data?.message === "User create & send email is success!") {
        notifySuccess("Sign up successfully, please check your confirmation email!");
        navigate("/");
      } else if (response?.data?.message === "User already exists!") {
        notifyWarn('Account already exists!');
      } else if (response?.data?.message === "Invalid data") {
        notifyWarn('Invalid data');
      } else {
        notifyError("Sign up failed!");
      }
    } catch (error) {
      console.error("Sign up failed", error.response.data);
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
    <div>
      <form onSubmit={handleSubmit}>
        <div className="pb-2 d-flex flex-row align-items-center">
          <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1 ">Email</p>
          <input
            required
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
            required
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
            required
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
            required
            className="input-field rounded-50 w-100"
            placeholder="dd-mm-yyyy"
            min="1900-01-01"
            max="2023-12-31"
            type="date"
            name="establishment"
            value={inputs.establishment || ""}
            onChange={handleChange}
          />
        </div>
        <div className="pb-2 d-flex flex-row align-items-center">
          <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1">Phone</p>
          <input
            required
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
            required
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
            required
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
          value="Sign up"
        />
      </form>
      <div className="d-flex flex-row pt-3 pb-3">
        <div className="d-flex col-12 google-btn justify-content-center">
          <GoogleLogin onSuccess={handleClickGG} onError={errorMessage} />
        </div>
      </div>
    </div>
  );
}
