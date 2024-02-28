import React from "react";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const notifySuccess = (noti) => {
    toast.success(noti, {
        position: "bottom-right",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored"
    });
}

export const notifyError = (noti) => {
    toast.error(noti, {
        position: "bottom-right",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored"
    });
}

export const notifyWarn = (noti) => {
    toast.warn(noti, {
        position: "bottom-right",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored"
    });
}

export const notifyInfo = (noti) => {
    toast.info(noti, {
        position: "bottom-right",
        autoClose: 3500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored"
    });
}

const Notification = () => {
    return null;
}

export default Notification;