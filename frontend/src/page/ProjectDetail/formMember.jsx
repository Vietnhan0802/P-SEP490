import { Modal, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import "./form-member.scss";
import { IoPersonAdd } from "react-icons/io5";
import { CiSearch } from "react-icons/ci";
import Select from 'react-select'
import { projectInstance, userInstance } from "../../axios/axiosConfig";
import defaultAvatar from '../../images/common/default.png'
import Notification, { notifySuccess, notifyError } from "../../components/notification";
function createData(id, avatar, fullName, email, role) {
  return { id, avatar, fullName, email, role }
}
function FormMember({ projectId, positionOption }) {
  const [show, setShow] = useState(false);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filterUsers, setFilterUsers] = useState([]);
  const optionsList = positionOption?.map((item) => {
    return {
      value: item.idPosition,
      label: item.namePosition
    }
  });
  const [invite, setInvite] = useState({
    idProject: projectId,
    userId: '',
    positionId: ''
  });
  const modalClose = () => setShow(false);
  const modalShow = () => setShow(true);
  useEffect(() => {
    userInstance.get(`GetAllUsers`)
      .then((res) => {
        const userList = res?.data?.result.filter((user) => user.role === "Member" );
        setUsers(userList.map((itemList) => createData(itemList.id, itemList.imageSrc, itemList.fullName, itemList.email, itemList.role)));
      })
      .catch((error) => { console.error(error); })
  }, [])
  const handlePositionChange = (selectedOption, userId) => {
    setInvite(prevState => ({
      ...prevState,
      userId: userId,
      positionId: selectedOption.value
    }));
  };

  const handleInvite = () => {
    // Example POST request with invite information
    const postData = {
      idProject: invite.idProject,
      userId: invite.userId,
      positionId: invite.positionId
    };
    projectInstance.post(`CreateProjectInvite/${postData.userId}?idProject=${postData.idProject}&idPosition=${postData.positionId}`)
      .then((res) => { console.log(res?.data?.result); setShow(false); notifySuccess(res?.data?.message); })
      .catch((error) => { console.error(error); notifyError("Send invite is fail!"); });
  };
  const handleSearch = (event) => {
    const userText = event.target.value;
    setSearch(userText);
    if (userText.trim() === '') {
      // Show all users if search text is empty
      setFilterUsers(users);
    } else {
      const userTextLowerCase = userText.toLowerCase();
      setFilterUsers(users.filter((item) => item.fullName.toLowerCase().includes(userTextLowerCase)));
    }
  }

  return (
    <div className="p-1">
      <Button variant="" onClick={modalShow}>
        <div className="d-flex align-items-center add-member">
          <IoPersonAdd className="pe-2 fs-3" />
          <p>Invite member</p>
        </div>
      </Button>
      <Modal show={show} onHide={modalClose} id='form-member'>
        <Modal.Header closeButton>
          <Modal.Title>Add member</Modal.Title>
        </Modal.Header>

        <Modal.Body className="popup-body" id="member-search">
          <div className="search-member">
            <div className="d-flex post-search align-items-center mb-3">
              <CiSearch className="" />
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder={"Search"}
                className="search-box size-20 w-100"
              />
            </div>
          </div>
          <div className="result size-20">
            {(search ? filterUsers : users).map((user) => (
              <div className="result-member mb-3 d-flex align-items-center justify-content-between mb-2">
                <div className="d-flex align-items-center">
                  <div className="member-avatar">
                    <img src={user.avatar === "https://localhost:7006/Images/" ? defaultAvatar : user.avatar} alt="avatar" />
                  </div>
                  <div className="ms-2 member-name d-flex flex-column justify-content-center">
                    <div className="name size-22">{user.fullName}</div>
                    <div className="email">{user.email}</div>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <Select
                    options={optionsList}
                    onChange={(selectedOption) => handlePositionChange(selectedOption, user.id)}
                  />
                  <button className="btn btn-info ms-3" onClick={() => handleInvite(user.id)}>Invite</button>
                </div>
              </div>))}
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
