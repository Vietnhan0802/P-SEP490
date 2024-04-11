import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { MdOutlineLockPerson } from "react-icons/md";
import { userInstance } from '../../axios/axiosConfig';
import Notification, { notifySuccess, notifyError } from "../../../src/components/notification";
import { IoIosWarning } from "react-icons/io";
import { useForm } from 'react-hook-form';
function ChangePass({ email }) {
    const [show, setShow] = useState(false);
    const [password, setPassword] = useState({});
    const [errorText, setErrorText] = useState([]);
    const modalShow = () => setShow(true);
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm();
    const oldPass = watch('oldpassword');
    const newPass = watch('newpassword');
    const confirmPass = watch('confirmpassword');
    const modalClose = () => {
        setShow(false);
        setErrorText([]); // Clear errors when modal is closed};
        // Modified modalSubmit function to include password check
    }
    const modalSubmit = handleSubmit((data) => {
        userInstance
            .post(`ChangePassword/${email}`, {
                password: data.oldpassword,
                newPassword: data.newpassword,
            })
            .then((res) => {

                setShow(false);
                reset(); // Reset the form after successful submission
                console.log(res?.data?.result);
                if (res?.data?.status === 'BadRequest') {
                    notifyError('Change password is fail!');
                } else {
                    notifySuccess('Change password is success!');
                }

            })
            .catch((error) => {
                console.error(error);
                notifyError('Change password is fail!');
            });
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPassword((prev) => ({ ...prev, [name]: value }));
    }
    return (
        <div>
            <MdOutlineLockPerson onClick={modalShow} size={28} />
            <Modal show={show} onHide={modalClose} id="update-infomation">
                <Modal.Header closeButton>
                    <Modal.Title>Change password</Modal.Title>
                </Modal.Header>
                <Modal.Body className="popup-body report-popup " id="report-body">
                    <label className="mt-2">Old Password</label>
                    <input
                        type="password"
                        className="form-control input-custom"
                        {...register('oldpassword', { required: 'Old password is required' })}
                        aria-label="Old password"
                    />
                    {errors.oldpassword && (
                        <div className='d-flex align-items-center'>
                            <p style={{ color: 'red' }}><IoIosWarning className='me-2' /></p>
                            <p style={{ color: 'red' }}>{errors.oldpassword.message}</p>
                        </div>
                    )}
                    <label className="mt-2">
                        New password
                    </label>
                    <input
                        type="password"
                        {...register('newpassword', {
                            required: 'New password is required',
                            validate: (value) => {
                                if (value === oldPass) {
                                    return 'New password cannot be the same as the old password'
                                }
                                // Thêm các validate khác nếu cần
                            }, pattern: {
                                value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9\s])[A-Za-z0-9\S]{8,}$/,
                                message: 'Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters',
                            },
                        })}
                        className="form-control input-custom"
                        aria-label="New password"
                    />
                    {errors.newpassword && (
                        <div className='d-flex align-items-center'>
                            <p style={{ color: 'red' }}><IoIosWarning className='me-2' /></p>
                            <p style={{ color: 'red' }}>{errors.newpassword.message}</p>
                        </div>
                    )}
                    <label className="mt-2">
                        Confirm password
                    </label>
                    <input
                        type="password"
                        {...register('confirmpassword', {
                            required: 'Confirm password is required',
                            validate: (value) => {
                                if (!value) {
                                    return 'Confirm password is required';
                                } else if (value === oldPass) {
                                    return 'Confirm password cannot be the same as old password';
                                } else if (value !== newPass) {
                                    return 'Confirm password cannot be the different old password';
                                } else {
                                    return true;
                                }
                            }, pattern: {
                                value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*[^A-Za-z0-9\s])[A-Za-z0-9\S]{8,}$/,
                                message: 'Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters',
                            },
                        })}
                        className="form-control input-custom"
                        aria-label="Confirm password"
                    />
                    {errors.confirmpassword && (
                        <div className='d-flex align-items-center'>
                            <p style={{ color: 'red' }}><IoIosWarning className='me-2' /></p>
                            <p style={{ color: 'red' }}>{errors.confirmpassword.message}</p>
                        </div>

                    )}
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
