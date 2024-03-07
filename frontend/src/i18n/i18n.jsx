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
            'viewfollow': 'View All',

            /**Translate notifi */
            'title_noti': 'Notification',
            'viewnoti': 'All',
            'notread': 'Unseen',

            /**Translate dashboard */
            'managepost': 'Manage Post',
            'manageaccess': 'Manage Access',
            'manageblog': 'Manage Blog',
            'managereport': 'Manage Report',
            'manageverification': 'Manage Verification',
            'newpost': 'New Posts',
            'newaccess': 'Accesses',
            'newblog': 'New Blogs',
            'newreport': 'New Reports',
            'newverification': 'Not processed yet',
            'viewing': 'Viewing',
            'viewdetail': 'View Detail',
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
            'viewfollow': 'Xem tất cả',

            /**Translate notifi */
            'title_noti': 'Thông báo',
            'viewnoti': 'Tất cả',
            'notread': 'Chưa xem',

            /**Translate dashboard */
            'managepost': 'Quản lý bài đăng',
            'manageaccess': 'Quản lý truy cập',
            'manageblog': 'Quản lý tin tức',
            'managereport': 'Quản lý báo cáo',
            'manageverification': 'Quản lý xác minh',
            'newpost': 'Bài đăng mới',
            'newaccess': 'Truy cập',
            'newblog': 'Tin tức mới',
            'newreport': 'Báo cáo mới',
            'newverification': 'Chưa được xử lý',
            'viewing': 'Đang xem',
            'viewdetail': 'Xem chi tiết',
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