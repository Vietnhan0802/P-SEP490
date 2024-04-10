import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../SignIn/signIn.scss";
import { useNavigate } from "react-router-dom";
import { userInstance } from "../../axios/axiosConfig";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { notifySuccess } from "../../components/notification";

function ResetPassword() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get("token");
  const email = urlParams.get("email");
  const newToken = decodeURIComponent(token);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();
  const oldPass = watch('password');
  const newPass = watch('confirmPassword');
  const onSubmit = async (data) => {
    try {
      const response = await userInstance.post("/ResetPassword", {
        password: data.password,
        confirmPassword: data.confirmPassword,
        email: email,
        token: newToken,
      });

      if (response?.data?.status === "NoContent") {
        notifySuccess("Password reset successful");
        navigate("/");
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
    <section className="signIn-bg hV-100 d-flex align-items-center">
      <div className="container">
        <div className="d-flex  m-auto mw-40" style={{ maxHeight: "90vh" }}>
          <div className="col-12 col signin white-bg d-flex align-items-center">
            <div className="h-auto w-100 py-4">
              <p className="SFU-bold size-40 blue2f text-center mb-3">
                Reset Password
              </p>
              <div className="form-area">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="pb-2">
                    <p className="size-20 blue2f SFU-heavy indent-30 pb-1">
                      Enter new password
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
                    {errors.password && (
                      <p className="text-danger"  style={{fontSize:'14px'}}>{errors.password.message}</p>
                    )}
                  </div>
                  <div className="pb-2">
                    <p className="size-20 blue2f SFU-heavy indent-30 pb-1">
                      Confirm new password
                    </p>
                    <input
                      className="input-field rounded-50 w-100"
                      placeholder="Enter your password"
                      type="password"
                      {...register("confirmPassword", {
                        required: "Confirm password is  required", 
                        validate: (value) => {
                          if (value !== oldPass) {
                              return 'Confirm password has be the same as new password'
                          }
                          // Thêm các validate khác nếu cần
                      },
                        pattern: {
                          value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9\s])[A-Za-z0-9\S]{8,}$/,
                          message: 'Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters',
                        },
                      })}
                    />

                  </div>
                  {errors.confirmPassword && (
                      <p className="text-danger" style={{fontSize:'14px'}}>{errors.confirmPassword.message}</p>
                    )}
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
        </div>
      </div>
    </section>
  );
}

export default ResetPassword;