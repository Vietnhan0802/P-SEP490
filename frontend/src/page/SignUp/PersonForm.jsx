import React from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { userInstance } from "../../axios/axiosConfig";
import { GoogleLogin } from '@react-oauth/google';
import { notifySuccess, notifyError } from "../../components/notification";
import { jwtDecode } from "jwt-decode";
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
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      const response = await userInstance.post("/SignUpMember", data);
      if (response?.data?.message === "User creates & sends email successfully!") {
        notifySuccess("Sign up successfully, please check your confirmation email!");
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
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  const validateEmail = (value) => {

    return emailRegex.test(value) || "Invalid email address";
  };
  const handleChange = (event) => {
    console.log(event.target);
    const { name, value, type, checked } = event.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: type === "checkbox" ? checked : value,
    }));
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

      const apiResponse = await userInstance.post(`/SignUpGoogleMember/${email}/${fullName}`);
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

  const errorMessage = (error) => {
    console.error("Google login error:", error);
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="pb-2 d-flex flex-row align-items-center">
          <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1">
            Email
          </p>
          <input
            className="input-field rounded-50 w-100"
            placeholder="Enter your email"
            type="tẽt"
            {...register("email", {
              required: 'Email  is required',
              validate: validateEmail
            })}
          />
        </div>
        {errors.email && <p className="text-danger small-txt">{errors.email.message}</p>}
        <div className="pb-2 d-flex flex-row align-items-center">
          <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1">
            Password
          </p>
          <input
            className="input-field rounded-50 w-100"
            placeholder="Enter your password"
            type="password"
            {...register("password", {
              required: "Password is  required", pattern: {
                value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9\s])[A-Za-z0-9\S]{8,}$/,
                message: 'Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters',
              },
            })}
          />
        </div>
        {errors.password && <p className="text-danger small-txt">{errors.password.message}</p>}
        <div className="pb-2 d-flex flex-row align-items-center">
          <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1">
            FullName
          </p>
          <input
            className="input-field rounded-50 w-100"
            placeholder="Enter your FullName"
            type="text"
            {...register("fullName", {
              required: "Full name is required",
              pattern: {
                value: /^\D*$/,
                message: 'Full name can not contain number',
              },
            })}
          />
        </div>
        {errors.fullName && <p className="text-danger small-txt">{errors.fullName.message}</p>}

        <div className="pb-2 d-flex flex-row align-items-center">
          <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1">
            Birthday
          </p>
          <input
            className="input-field rounded-50 w-100"
            placeholder="dd-mm-yyyy"
            min="1900-01-01"
            max="2023-12-31"
            type="date"
            {...register("birthday", { required: "Birthday day is required" })}
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
          <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1">
            Phone
          </p>
          <input
            className="input-field rounded-50 w-100"
            placeholder="Enter your Phone"
            type="text"
            {...register("phone", {
              required: "Phone number is required", pattern: {
                value: /^0\d{9}$/,
                message: 'Phone number starts with 0 and has to have 10 number',
              },
            })}
          />
        </div>
        {errors.phone && <p className="text-danger small-txt">{errors.phone.message}</p>}
        <div className="pb-2 d-flex flex-row align-items-center">
          <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1">
            Tax
          </p>
          <input
            className="input-field rounded-50 w-100"
            placeholder="Enter your Tax"
            type="text"
            {...register("tax", {
              required: "Tax number is required", pattern: {
                value: /^\d{10}$/,
                message: 'Tax number has to be 10 digit',
              }
            })}
          />
        </div>
        {errors.tax && <p className="text-danger small-txt">{errors.tax.message}</p>}
        <div className="pb-2 d-flex flex-row align-items-center">
          <p className="col-sm-3 col-5 size-20 blue2f SFU-heavy pb-1">
            Address
          </p>
          <input
            className="input-field rounded-50 w-100"
            placeholder="Enter your Address"
            type="text"
            {...register("address", { required: "Address is required" })}
          />
        </div>
        {errors.address && <p className="text-danger small-txt">{errors.address.message}</p>}
        <button
          className="submit-btn rounded-50 mt-2   size-20 white SFU-bold w-100"
          type="submit"
          value="Sign up for Person"
        >
          Sign up
        </button>
      </form>
      <div className="d-flex flex-row pt-3 pb-3">
        <div className="d-flex col-12 google-btn justify-content-center">
          <GoogleLogin onSuccess={handleClickGG} onError={errorMessage} />
        </div>
      </div>
    </div>
  );
}
