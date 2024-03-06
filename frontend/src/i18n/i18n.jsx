import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            /**Translate sidebar */
            'post': 'Post',
            'blog': 'Blog',
            'dashboard': 'Dashboard',
            'statistic': 'Statistic',
            'logout': 'Log Out',
            'logout_bottom': '© Copyright © 2024 | All Rights Reversed',

            /**Translate haeder */
            'search': 'Search',

            /**Translate follow */
            'following': 'Following',
            'viewfollow': 'View All'
        }
    },
    vi: {
        translation: {
            /**Translate sidebar */
            'post': 'Bài đăng',
            'blog': 'Tin tức',
            'dashboard': 'Trung tâm',   
            'statistic': 'Thống kê',
            'logout': 'Đăng xuất',
            'logout_bottom': '© Bản quyền © 2024 | Mọi quyền đã bị đảo ngược',

            /**Translate haeder */
            'search': 'Tìm kiếm',

            /**Translate follow */
            'following': 'Đang Follow',
            'viewfollow': 'Xem tất cả'
        }
    }
};

i18n.use(initReactI18next).init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false
    }
});