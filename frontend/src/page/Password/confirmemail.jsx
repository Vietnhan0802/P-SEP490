import React, { useEffect } from "react";
function Confirmemail() {
  return (
    <section
      id="signInForm"
      className="signIn-bg hV-100 d-flex align-items-center"
    >
      <div className="container">
        <div className="d-flex  m-auto mw-40" style={{ maxHeight: "90vh" }}>
          <div className="col-12 col white-bg d-flex align-items-center signin">
            <div className="h-auto w-100  py-4">
              <p className="SFU-bold size-40 blue2f text-center mb-3">
                Confirm Your Email Address
              </p>
              <a className="un-decor SFU-book blue55 size-20 pb-2" href="/">
                <p className="text-center">Return to Sign in</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Confirmemail;
