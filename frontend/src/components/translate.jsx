import React, { useState } from "react";
import "../scss/translate.scss"
import { useTranslation } from 'react-i18next';

const {i18n} = useTranslation();

const Translate = () => {
    
    const changeLanguage = (lng: 'en' | 'vi') => {
        i18n.changeLanguage(lng)
    }

    return (
        <div className="content">
            <div className="language-vi" onClick={() => changeLanguage('vi')}>VN</div>
            <div className="language-en" onClick={() => changeLanguage('en')}>EN</div>
        </div>
    );
};

export default Translate;