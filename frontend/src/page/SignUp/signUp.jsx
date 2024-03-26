import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import GGIcon from "../../images/common/gg-icon.png";
import FBIcon from "../../images/common/fb-icon.png";
import "../SignUp/signUp.scss";

import { useState } from "react";
import PersonForm from "./PersonForm";
import BusinessForm from "./BusinessForm";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [showForm1, setShowForm1] = useState(true);
  const [showForm2, setShowForm2] = useState(false);
  const navigate = useNavigate();

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
  const handleClickGG = () => {


  };
  const returnSignIn = () => {
    navigate('/');
  }
  const handleClickFB = () => {
    // implementation details
  };

  return (
    <section
      id="signInForm"
      className="signIn-bg hV-100 d-flex align-items-center"
    >
      <div className="container">
        <div className="d-flex signup-mw-40  m-auto align-items-center form-shadow  flex-column-reverse flex-lg-row" style={{ maxHeight: '90vh' }}>
          <div className="col-12 col signin bg-white pt-2 pb-4  position-relative">
            <IoMdArrowRoundBack className="position-absolute" size={48} style={{ top: '20px', left: '20px' }} onClick={returnSignIn} />
            <p className="SFU-bold size-40 blue2f text-center py-lg-3">
              SIGN UP
            </p>
            <div className="d-flex justify-content-around mb-3">
              <button
                onClick={() => handleFormClick(1)}
                className={`gray-border white-bg d-flex w-25 flex-row rounded-50 align-items-center justify-content-center ${showForm1 === true ? "active-item" : ""
                  }`}
              >
                Member
              </button>
              <button
                onClick={() => handleFormClick(2)}
                className={`gray-border white-bg d-flex w-25 flex-row rounded-50 align-items-center justify-content-center ${showForm2 === true ? "active-item" : ""
                  }`}
              >
                Business
              </button>
            </div>
            <div className="form-area">
              {showForm1 && <PersonForm />}
              {showForm2 && <BusinessForm />}
              <div className="row justify-content-center align-items-center pt-2">

                <div className="col-5 col-12 text-center size-20">
                  Sign up with
                </div>

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
        </div>
      </div>
    </section>
  );
}
