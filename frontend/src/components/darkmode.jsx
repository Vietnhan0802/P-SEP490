import React, { useState } from "react";
import { ReactComponent as Moon } from "../images/common/Moon.svg";
import { ReactComponent as Sun } from "../images/common/Sun.svg";
import "../scss/darkmode.scss";

const DarkMode = ({changeTheme}) => {
    const [reset, setReset] = useState(false);
    const setDarkMode = () => {
        document.querySelector("body").setAttribute('data-theme', 'dark')
        localStorage.setItem("selectedTheme", "dark")
    };
    const setLightMode = () => {
        document.querySelector("body").setAttribute('data-theme', 'light')
        localStorage.setItem("selectedTheme", "light")
    };

    const selectedTheme = localStorage.getItem("selectedTheme");
    if (selectedTheme === "dark") {
        setDarkMode();
    }

    const toggleTheme = e => {
        if (e.target.checked) {
            setDarkMode();
            changeTheme(true);
        }
        else {
            setLightMode();
            changeTheme(false);
        }
    }

    return (
        <div className='dark_mode me-5'>
            <input
                className='dark_mode_input'
                type='checkbox'
                id='darkmode-toggle'
                onChange={toggleTheme}
                defaultChecked={selectedTheme === "dark"}
            />
            <label className='dark_mode_label' htmlFor='darkmode-toggle'>
                <Sun />
                <Moon />
            </label>
        </div>
    );
};

export default DarkMode;