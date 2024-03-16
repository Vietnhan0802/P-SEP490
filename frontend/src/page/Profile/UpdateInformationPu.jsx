import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import "../../components/report-popup/popup.scss";
import { FiEdit } from "react-icons/fi";
function UpdateInformationPu() {
  const [show, setShow] = useState(false);
  const modalClose = () => setShow(false);
  const modalShow = () => setShow(true);

  //   const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (event) => {};

  const modelSubmit = (event) => {
    event.preventDefault();

    modalClose();
  };

  return (
    <div className="p-1">
      <FiEdit onClick={modalShow} id="btn-update-project" />

      <Modal show={show} onHide={modalClose} id="update-infomation">
        <Modal.Header closeButton>
          <Modal.Title>Update Information</Modal.Title>
        </Modal.Header>

        <Modal.Body className="popup-body report-popup " id="report-body">
          <label className="mt-2">Full Name:</label>
          <input
            type="text"
            className="form-control"
            name="fullName"
            // value={inputs.fullName}

            onChange={handleChange}
            aria-label="Full name"
          />

          <label className="mt-2">
            {1 === "1" ? "Establish date" : "Birthday"}
            {/* {inputs.role === "Business" ? "Establish date" : "Birthday"} */}
          </label>
          <input
            type="date"
            name="date"
            // value={inputs.date}
            onChange={handleChange}
            className="form-control"
            aria-label="Birthday"
          />

          <label className="mt-2">Phone number</label>
          <input
            type="text"
            name="phoneNumber"
            // value={inputs.phoneNumber}
            onChange={handleChange}
            className="form-control"
            aria-label="Phone number"
          />
          {1 !== "1" && (
            // {inputs.role !== "Business" && (
            <div>
              <label className="mt-2">Gender:</label>
              <div className="">
                {!1 ? (
                  1 ? (
                    // {!isEdit ? (
                    //   user.isMale ? (
                    <p>Male</p>
                  ) : (
                    <p>Female</p>
                  )
                ) : (
                  <div className="checkbox-wrapper-13 bg-text">
                    <label>
                      <input
                        id="c1-13"
                        className="me-1"
                        type="checkbox"
                        checked={1}
                        // checked={inputs.isMale}
                        name="isMale"
                        // onChange={() =>
                        //   handleChange({
                        //     target: { name: "isMale", value: true },
                        //   })
                        // }
                      />
                      Male
                    </label>

                    <label className="ps-4">
                      <input
                        id="c1-13"
                        className="me-1"
                        type="checkbox"
                        checked={!1}
                        // checked={!inputs.isMale}
                        name="isMale"
                        // onChange={() =>
                        //   handleChange({
                        //     target: { name: "isMale", value: false },
                        //   })
                        // }
                      />
                      Female
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}
          <label className="mt-2">Address:</label>
          <input
            type="text"
            name="address"
            className="form-control"
            // value={inputs.address}
            onChange={handleChange}
            aria-label="Address"
          />
          <label className="mt-2 ">Tax:</label>
          <input
            type="number"
            name="tax"
            className="form-control"
            // value={inputs.tax}
            onChange={handleChange}
            aria-label="Tax"
          />

          <label className="mt-2">Description:</label>
          <textarea
            type="text"
            name="description"
            // value={inputs.description || ""}
            // placeholder="Hope you will give us some description about yourselves"
            onChange={handleChange}
            style={{ maxHeight: '200px'}}
            className="form-control"
            aria-label="Description"
          />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={modalClose}>
            Close
          </Button>
          <Button variant="warning" onClick={modelSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default UpdateInformationPu;
