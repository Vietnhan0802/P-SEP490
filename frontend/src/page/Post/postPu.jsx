import { Modal, Button } from "react-bootstrap";
import { useState } from "react";
import { Row, Col } from "react-bootstrap";
import "./post-pu.scss";
function PostPu() {
  const [show, setShow] = useState(false);
  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };
  const [inputs, setInputs] = useState({
    title: "",
    content: "",
    CreateUpdateBlogImages: [], // new state for managing multiple images
  });
  const handleInputChange = (event) => {
    const { name, value, type } = event.target;
    if (type === "file") {
      const files = Array.from(event.target.files);

      // Use FileReader to convert each file to base64
      const newImages = files.map(async (element) => {
        const base64String = await readFileAsDataURL(element);
        return {
          image: element.name,
          imageFile: element,
          imageSrc: base64String,
        };
      });
      Promise.all(newImages).then((convertedImages) => {
        setInputs((values) => ({
          ...values,
          CreateUpdateBlogImages: [
            ...values.CreateUpdateBlogImages,
            ...convertedImages,
          ],
        }));
      });
    } else {
      setInputs((values) => ({ ...values, [name]: value }));
    }
  };
  const modalClose = () => setShow(false);
  const modalShow = () => setShow(true);
  const modelSubmit = () => setShow(false);
  return (
    <div className="">
      <Button variant="m-0 btn btn-primary me-2" onClick={modalShow}>
        Add Degree
      </Button>
      <Modal show={show} onHide={modalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Degree</Modal.Title>
        </Modal.Header>
        {/* public string name { get; set; }
   public string institution { get; set; }
   public string country { get; set; }
   public string type { get; set; }
   public string major { get; set; }
   public string image { get; set; } */}
        <Modal.Body className="popup-body">
          <input
            type="text"
            name="title"
            value={inputs.title}
            onChange={handleInputChange}
            className="input-text form-control mb-3"
            placeholder="Name"
          />
          <input
            type="text"
            value={inputs.content}
            name="content"
            onChange={handleInputChange}
            className="input-text form-control mb-3"
            placeholder="Institution"
          />
          <input
            type="text"
            value={inputs.content}
            name="content"
            onChange={handleInputChange}
            className="input-text form-control mb-3"
            placeholder="Country"
          />
          <input
            type="text"
            value={inputs.content}
            name="content"
            onChange={handleInputChange}
            className="input-text form-control mb-3"
            placeholder="type"
          />
          <input
            type="text"
            value={inputs.content}
            name="content"
            onChange={handleInputChange}
            className="input-text form-control mb-3"
            placeholder="major"
          />
          <input
            type="file"
            name="images"
            onChange={handleInputChange}
            className="form-control "
          />
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={modalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={modelSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PostPu;
