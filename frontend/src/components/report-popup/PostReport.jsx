import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import "./popup.scss";
import { IoFlagOutline } from "react-icons/io5";
function PostReport() {
  const [show, setShow] = useState(false);
  const modalClose = () => setShow(false);
  const modalShow = () => setShow(true);

  const [selectedOption, setSelectedOption] = useState("");

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const modelSubmit = (event) => {
    event.preventDefault();
    if (!selectedOption) {
      alert("Please select an option before submitting.");
      return;
    }
    alert(`Report submitted for: ${selectedOption}`);
    modalClose();
  };

  return (
    <div className="p-1">
      <IoFlagOutline onClick={modalShow} className="ReportBtn" />

      <Modal show={show} onHide={modalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Report Content</Modal.Title>
        </Modal.Header>

        <Modal.Body className="popup-body report-popup" id="report-body">
          <div className="option hateAndHarassment form-control">
            <input
              type="radio"
              id="hateAndHarassment"
              name="reportType"
              value="hateAndHarassment"
              onChange={handleChange}
              checked={selectedOption === "hateAndHarassment"}
            />
            <label htmlFor="hateAndHarassment">Hate and Harassment</label>
            <div className={`option-content ${selectedOption === "hateAndHarassment" ? "open" : ""}`}>
              {selectedOption === "hateAndHarassment" && (
                <p>
                  *We do not allow the posting of content:
                  <br />
                  ** Behavior that insults or threatens others, including using obscene language to degrade them
                  <br />
                  ** Threats to perform actions such as collecting information, blackmailing, disclosing
                </p>
              )}
            </div>
          </div>
          <div className="option shockingContent form-control">
            <input
              type="radio"
              id="shockingContent"
              name="reportType"
              value="shockingContent"
              onChange={handleChange}
              checked={selectedOption === "shockingContent"}
            />
            <label htmlFor="shockingContent">
              Shocking and Offensive Content
            </label>
            <div className={`option-content ${selectedOption === "shockingContent" ? "open" : ""}`}>
              {selectedOption === "shockingContent" && (
                <p>
                  *We do not allow the posting of content:
                  <br />
                  ** Images of death, accidents
                  <br />
                  ** Human or animal body parts that are cut, mutilated, burned,
                  or severely injured
                </p>
              )}
            </div>
          </div>

          <div className="option misinformation form-control">
            <input
              type="radio"
              id="misinformation"
              name="reportType"
              value="misinformation"
              onChange={handleChange}
              checked={selectedOption === "misinformation"}
            />
            <label htmlFor="misinformation">Misinformation</label>
            <div className={`option-content ${selectedOption === "misinformation" ? "open" : ""}`}>
              {selectedOption === "misinformation" && (
                <p>
                  *We do not allow the posting of content:
                  <br />
                  ** False information that poses a danger to the community or
                  causes panic
                  <br />
                  ** Schemes promoting violence, hatred, or targeting individuals
                </p>
              )}
            </div>

          </div>
          <div className="option fraudAndScam form-control">
            <input
              type="radio"
              id="fraudAndScam"
              name="reportType"
              value="fraudAndScam"
              onChange={handleChange}
              checked={selectedOption === "fraudAndScam"}
            />
            <label htmlFor="fraudAndScam">Fraud and Scam</label>
            <div className={`option-content ${selectedOption === "fraudAndScam" ? "open" : ""}`}>
              {selectedOption === "fraudAndScam" && (
                <p>
                  *We do not allow the posting of content:
                  <br />
                  ** Financial scams, recruitment or impersonation scams including
                  identity theft
                  <br />
                  ** Collusion or assistance in scamming or instructions on how to
                  scam
                </p>
              )}
            </div>
          </div>
          <div className="option others form-control">
            <input
              type="radio"
              id="others"
              name="reportType"
              value="others"
              onChange={handleChange}
              checked={selectedOption === "others"}
            />
            <label htmlFor="others">Others</label>
            <div className={`option-content ${selectedOption === "others" ? "open" : ""}`}>
              {selectedOption === "others" && (
                <p>
                  *Our priority is to provide a safe environment. We encourage the
                  removal of scam content and accounts. Choose this option if your
                  report does not fit into any category.
                </p>
              )}
            </div>

          </div>
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
export default PostReport;
