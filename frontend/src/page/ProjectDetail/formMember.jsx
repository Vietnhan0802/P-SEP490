import { Modal, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import "./form-member.scss";
import { IoPersonAdd } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import Avatar from "../../images/common/post-img-3.png";
import { userInstance } from "../../axios/axiosConfig";
function createData(id, avatar, fullName, email, role) {
  return { id, avatar, fullName, email, role }
}
function FormMember() {
  const [show, setShow] = useState(false);

  const modalClose = () => setShow(false);
  const modalShow = () => setShow(true);
  useEffect(() => {
    userInstance.get(`GetAllUsers`)
      .then((res) => { console.log(res?.data?.result) })
      .catch((error) => { console.error(error); })
  }, [])
  return (
    <div className="p-1">
      <Button variant="" onClick={modalShow}>
        <div className="d-flex align-items-center add-member">
          <IoPersonAdd className="pe-2 fs-3" />
          <p>Add member</p>
        </div>
      </Button>
      <Modal show={show} onHide={modalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add member</Modal.Title>
        </Modal.Header>

        <Modal.Body className="popup-body" id="member-search">
          <div className="search-member">
            <div className="d-flex post-search align-items-center mb-3">
              <CiSearch className="" />
              <input
                type="text"
                placeholder={"Search"}
                className="search-box size-20"
              />
            </div>
          </div>
          <div className="result size-20">
            <div className="result-member mb-3 d-flex align-items-center justify-content-between mb-2">
              <div className="d-flex align-items-center">
                <div className="member-avatar">
                  <img src={Avatar} alt="avatar" />
                </div>
                <div className="ms-2 member-name d-flex flex-column justify-content-center">
                  <div className="name size-22">aaaaaaaaaaaaaa</div>
                  <div className="email">aaaaaaaaaaaaaaaaaaaa</div>
                </div>
              </div>
              <div>
                <button className="btn btn-info">Invite</button>
              </div>
            </div>
            <div className="result-member mb-3 d-flex align-items-center justify-content-between mb-2">
              <div className="d-flex align-items-center">
                <div className="member-avatar">
                  <img src={Avatar} alt="avatar" />
                </div>
                <div className="ms-2 member-name d-flex flex-column justify-content-center">
                  <div className="name size-22">aaaaaaaaaaaaaa</div>
                  <div className="email">aaaaaaaaaaaaaaaaaaaa</div>
                </div>
              </div>
              <div>
                <button className="btn btn-info">Invite</button>
              </div>
            </div>
            <div className="result-member mb-3 d-flex align-items-center justify-content-between mb-2">
              <div className="d-flex align-items-center">
                <div className="member-avatar">
                  <img src={Avatar} alt="avatar" />
                </div>
                <div className="ms-2 member-name d-flex flex-column justify-content-center">
                  <div className="name size-22">aaaaaaaaaaaaaa</div>
                  <div className="email">aaaaaaaaaaaaaaaaaaaa</div>
                </div>
              </div>
              <div>
                <button className="btn btn-info">Invite</button>
              </div>
            </div>
            <div className="result-member mb-3 d-flex align-items-center justify-content-between mb-2">
              <div className="d-flex align-items-center">
                <div className="member-avatar">
                  <img src={Avatar} alt="avatar" />
                </div>
                <div className="ms-2 member-name d-flex flex-column justify-content-center">
                  <div className="name size-22">aaaaaaaaaaaaaa</div>
                  <div className="email">aaaaaaaaaaaaaaaaaaaa</div>
                </div>
              </div>
              <div>
                <button className="btn btn-info">Invite</button>
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={modalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default FormMember;
