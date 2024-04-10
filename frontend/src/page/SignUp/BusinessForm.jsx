import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { userInstance } from "../../axios/axiosConfig";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { notifySuccess, notifyError } from "../../components/notification";

export default function BusinessForm() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const response = await userInstance.post("/SignUpBusiness", data);
      if (response?.data?.message === "User creates & sends email successfully!") {
        notifySuccess("Sign up successfully, please check your confirmation email!");
        reset(); // Reset form fields after successful submission
        navigate("/");
      } else if (response?.data?.message === "User already exists!") {
        notifyError('Account already exists!');
      } else if (response?.data?.message === "Invalid data") {
        notifyError('Invalid data');
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

      const apiResponse = await userInstance.post(`/SignUpGoogleBusiness/${email}/${fullName}`);
      if (apiResponse?.data?.message === "User creates is success!") {
        notifySuccess('Sign up successfully!');
        navigate("/");
      } else if (apiResponse?.data?.message === "User already exists!") {
        notifyError('Account already exists!');
      } else {
        notifyError("Sign up failed!");
      }
    } catch (error) {
      console.error("Error during sign in:", error);
    }
  };
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  const validateEmail = (value) => {

    return emailRegex.test(value) || "Invalid email address";
  };
  const errorMessage = (error) => {
    console.error("Google login error:", error);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="pb-2 d-flex flex-row align-items-center">
          <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1">Email</p>
          <input
            {...register("email", {
              required: 'Email  is required',
              validate: validateEmail
            })}
            className="input-field rounded-50 w-100"
            placeholder="Enter your email"
            type="text"
          />
        </div>
        {errors.email && <p className="text-danger small-txt">{errors.email.message}</p>}
        <div className="pb-2 d-flex flex-row align-items-center">
          <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1">Password</p>
          <input
            {...register("password", {
              required: true, pattern: {
                value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9\s])[A-Za-z0-9\S]{8,}$/,
                message: 'Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters',
              },
            })}
            className="input-field rounded-50 w-100"
            placeholder="Enter your password"
            type="password"
          />
        </div>
        {errors.password && <p className="text-danger small-txt">{errors.password.message}</p>}
        <div className="pb-2 d-flex flex-row align-items-center">
          <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1">FullName</p>
          <input
            {...register("fullName", {
              required: "Full name is required",
              pattern: {
                value: /^\D*$/,
                message: 'Full name can not contain number',
              },
            })}
            className="input-field rounded-50 w-100"
            placeholder="Enter Business Name"
            type="text"
          />
        </div>
        {errors.fullName && <p className="text-danger small-txt">{errors.fullName.message}</p>}
        <div className="pb-2 d-flex flex-row align-items-center">
          <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1">Establish Day</p>
          <input
            {...register("establishment", { required: "Establishment day is required" })}
            className="input-field rounded-50 w-100"
            placeholder="dd-mm-yyyy"
            min="1900-01-01"
            max="2023-12-31"
            type="date"
          />
        </div>
        {errors.establishment && <p className="text-danger small-txt">{errors.establishment.message}</p>}
        <div className="pb-2 d-flex flex-row align-items-center">
          <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1">Phone</p>
          <input
            {...register("phone", {
              required: "Phone number is required", pattern: {
                value: /^0\d{9}$/,
                message: 'Phone number starts with 0 and has to have 10 number',
              },
            })}
            className="input-field rounded-50 w-100"
            placeholder="Enter Phone Number"
            type="text"
          />
        </div>
        {errors.phone && <p className="text-danger small-txt">{errors.phone.message}</p>}
        <div className="pb-2 d-flex flex-row align-items-center">
          <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1">Tax</p>
          <input
            {...register("tax", {
              required: "Tax number is required", pattern: {
                value: /^\d{10}$/,
                message: 'Tax number has to be 10 digit',
              }
            })}
            className="input-field rounded-50 w-100"
            placeholder="Enter your Tax"
            type="text"
          />
        </div>
        {errors.tax && <p className="text-danger small-txt">{errors.tax.message}</p>}
        <div className="pb-2 d-flex flex-row align-items-center">
          <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1">Address</p>
          <input
            {...register("address", { required: "Address is required" })}
            className="input-field rounded-50 w-100"
            placeholder="Enter your Address"
            type="text"
          />
        </div>
        {errors.address && <p className="text-danger small-txt">{errors.address.message}</p>}
        <input
          className="submit-btn rounded-50 size-20 white mt-2 SFU-bold w-100"
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