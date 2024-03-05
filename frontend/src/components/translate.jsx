import React, { useState } from "react";
import "../scss/translate.scss"
import { useTranslation } from 'react-i18next';

const Translate = () => {
    const {i18n} = useTranslation();

    const changeLanguage = (lng) => {
        if (lng === 'en' || lng === 'vi') {
            i18n.changeLanguage(lng);
        } else {
            console.error('Unsupported language');
        }
    }

    return (
        <div className="content">
            <div className="language-vi active" onClick={() => changeLanguage('vi')}>VN</div>
            <div className="language-en active" onClick={() => changeLanguage('en')}>EN</div>
        </div>
    );
};

export default Translate;