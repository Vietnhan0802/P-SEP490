import i18l from 'i18next';
import { initReactI18next } from 'react-i18next'

const resources = {
    en: {
        translation: {
            'post': 'Post'
        }
    },
    vi: {
        translation: {
            'post': 'Bài đăng'
        }
    }
}

i18l.use(initReactI18next).init({
    resources,
    lng: 'vi',
    fallbackLng: 'vi',
    interpolation: {
        escapeValue: false
    }
})