import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { MdOutlineLockPerson } from "react-icons/md";
import { userInstance } from '../../axios/axiosConfig';

function ChangePass({ email }) {
    const [show, setShow] = useState(false);
    const [password, setPassword] = useState({});
    const [errorText, setErrorText] = useState([]);
    const modalShow = () => setShow(true);
    const modalClose = () => {
        setShow(false);
        setErrorText([]); // Clear errors when modal is closed};
        // Modified modalSubmit function to include password check
    }
    const modalSubmit = () => {
        let errors = []; // Temporary array to hold errors
        // Check if the new password is the same as the old password
        if (password.newpassword === password.oldpassword) {
            errors.push("The new password cannot be the same as the old password.");
        }
        // Check if the new password matches the confirm password
        if (password.newpassword !== password.confirmpassword) {
            errors.push("The new password and confirm password do not match.");
        }

        if (errors.length > 0) {
            setErrorText(errors); // Set the collected errors
            return; // Prevent further actions if there are errors
        }
        if (errors.length === 0) {
            userInstance.post(`ChangePassword/${email}`,
                { password: password.oldpassword, newPassword: password.newpassword })
                .then((res) => {
                    setShow(false);
                    setErrorText([]); // Optionally clear errors on successful action
                    console.log(res?.data?.result);
                })
                .catch((error) => { console.error(error); })
        }

    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPassword((prev) => ({ ...prev, [name]: value }));
    }
    return (
        <div>
            <MdOutlineLockPerson onClick={modalShow} size={28} />
            <Modal show={show} onHide={modalClose} id="update-infomation">
                <Modal.Header closeButton>
                    <Modal.Title>Update Information</Modal.Title>
                </Modal.Header>
                <Modal.Body className="popup-body report-popup " id="report-body">
                    {/* Display error messages if any */}
                    {errorText.length > 0 && (
                        <ul>
                            {errorText.map((error, index) => (
                                <li key={index} style={{ color: 'red' }}>
                                    {error}
                                </li>
                            ))}
                        </ul>
                    )}
                    <label className="mt-2">Old Password</label>
                    <input
                        type="password"
                        className="form-control"
                        name="oldpassword"
                        onChange={handleChange}
                        aria-label="Old password"
                    />

                    <label className="mt-2">
                        New password
                    </label>
                    <input
                        type="password"
                        name="newpassword"
                        // value={user?.date}
                        onChange={handleChange}
                        className="form-control"
                        aria-label="New password"

                    />
                    <label className="mt-2">
                        Confirm password
                    </label>
                    <input
                        type="password"
                        name="confirmpassword"
                        // value={user?.date}
                        onChange={handleChange}
                        className="form-control"
                        aria-label="Confirm password"
                    />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={modalClose}>
                        Close
                    </Button>
                    <Button variant="warning" onClick={modalSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ChangePass
