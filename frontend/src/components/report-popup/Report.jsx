import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import "./popup.scss";
import { IoFlagOutline } from "react-icons/io5";
import { reportInstance } from "../../axios/axiosConfig";
function Report({ id, idItem, type }) {
  const [show, setShow] = useState(false);
  const modalClose = () => setShow(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [reportType, setReportType] = useState('');
  const handleChange = (event, content) => {
    // Add a small delay to allow for a smoother transition effect
    // when switching between options
    const value = event.target.value;
    if (selectedOption !== value) {
      setReport((prev => ({ ...prev, content: content })));
      setSelectedOption(""); // Reset or collapse all options first
      setTimeout(() => {
        setSelectedOption(value); // Then open the new option after a slight delay
      }, 100); // Adjust delay timing as necessary for smoothness
    }
  };
  const [report, setReport] = useState({
    idReporter: '',
    idPosted: '',
    content: ''
  })
  const modalShow = () => {
    setShow(true);
    setReport((prev) => ({ ...prev, idReporter: id, idPosted: idItem }));
    setReportType(type);
  };
  const handleCreateReport = () => {
    if (reportType === 'post') {
      reportInstance.post(`CreatePostReport/${report.idReporter}/${report.idPosted}/${report.content}`)
        .then((res) => {
          console.log(res?.data?.result);
          setShow(false);
        })
        .catch((error) => { console.error(error) })
    } else if (reportType === 'blog') {
      reportInstance.post(`CreateBlogReport/${report.idReporter}/${report.idPosted}/${report.content}`)
        .then((res) => {
          console.log(res?.data?.result);
          setShow(false);
        })
        .catch((error) => { console.error(error) })
    } else {
      reportInstance.post(`CreateBlogReport/${report.idReporter}/${report.idPosted}/${report.content}`)
        .then((res) => {
          console.log(res?.data?.result);
          setShow(false);
        })
        .catch((error) => { console.error(error) })
    }
  }

  const data = [
    {
      id: "hateAndHarassment",
      title: "Hate and Harassment",
      content: `*We do not allow the posting of content:
      <br />
    ** Behavior that insults or threatens others, including using obscene language to degrade them
      <br />
    ** Threats to perform actions such as collecting information, blackmailing, disclosing`
    }, {
      id: "shockingContent",
      title: "Shocking and Offensive Content",
      content: ` *We do not allow the posting of content:
      <br />
      ** Images of death, accidents
      <br />
      ** Human or animal body parts that are cut, mutilated, burned,
      or severely injured`
    }, {
      id: "missinformation",
      title: "Miss information",
      content: `*We do not allow the posting of content:
      <br />
      ** False information that poses a danger to the community or
      causes panic
      <br />
      ** Schemes promoting violence, hatred, or targeting individuals`
    }, {
      id: "fraudAndScam",
      title: "Fraud and Scam",
      content: `    *We do not allow the posting of content:
      <br />
      ** Financial scams, recruitment or impersonation scams including
      identity theft
      <br />
      ** Collusion or assistance in scamming or instructions on how to
      scam`
    }, {
      id: "others",
      title: "Others",
      content: `*Our priority is to provide a safe environment. We encourage the
      removal of scam content and accounts. Choose this option if your
      report does not fit into any category.`
    }]


  return (
    <div className="p-1">
      <IoFlagOutline onClick={modalShow} className="ReportBtn" size={28} />

      <Modal show={show} onHide={modalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Report Content</Modal.Title>
        </Modal.Header>

        <Modal.Body className="popup-body report-popup" id="report-body">
          {data.map((item) => (<div className={`option ${item.id} form-control`}>
            <input
              type="radio"
              id={item.id}
              name="reportType"
              value={item.id}
              onChange={(event, content) => handleChange(event, item.title)}
              checked={selectedOption === item.id}
            />
            <label htmlFor={item.id}>{item.title}</label>
            <div className={`option-content ${selectedOption === item.id ? "open" : ""}`}>
              {selectedOption === item.id && (
                <p dangerouslySetInnerHTML={{ __html: item.content }}>
                </p>
              )}
            </div>
          </div>))}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={modalClose}>
            Close
          </Button>
          <Button variant="warning" onClick={handleCreateReport}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default Report;
