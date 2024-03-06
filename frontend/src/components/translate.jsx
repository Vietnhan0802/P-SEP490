import React, { useState } from "react";
import "../scss/translate.scss"
import { useTranslation } from 'react-i18next';
import { GrLanguage } from "react-icons/gr";

const Translate = () => {
    const { i18n } = useTranslation();
    const [showDropdown, setShowDropdown] = useState(false);

    const changeLanguage = (lng) => {
        if (lng === 'en' || lng === 'vi') {
            i18n.changeLanguage(lng);
            setShowDropdown(false);
        } else {
            console.error('Unsupported language');
        }
    }

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    }

    return (
        <div className="nav-wrapper">
            <div className="sl-nav">
                <GrLanguage className="lang" />
                <ul>
                    <li>
                        <b onClick={toggleDropdown}>
                            {i18n.language === 'en' ? 'English' : 'Việt Nam'}
                        </b>
                        <div className="triangle"></div>
                        {showDropdown && (
                            <ul>
                                <li onClick={() => changeLanguage('en')}>
                                    <span className={i18n.language === 'en' ? 'active' : ''}>English</span>
                                </li>
                                <li onClick={() => changeLanguage('vi')}>
                                    <span className={i18n.language === 'vi' ? 'active' : ''}>Việt Nam</span>
                                </li>
                            </ul>
                        )}
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Translate;