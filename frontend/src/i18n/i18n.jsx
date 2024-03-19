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
            'and': 'and',
            'people': 'other people',
            'content_notifollow': ' has just started following you.',
            'content_notipostlike': ' has liked for your post.',
            'content_notipostcomment': ' commented on one of your post.',
            'content_notipostreply': ' reply on one of your comment.',
            'content_notiblog': ' commented on one of your blog.',
            'content_notiprojectapply': ' has applied for your project.',
            'content_notiprojectinvite': ' has invited your for project.',

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
            'and': 'và',
            'people': 'người khác',
            'content_notifollow': ' đã bắt đầu theo dõi bạn.',
            'content_notipostlike': ' đã thích bài viết của bạn.',
            'content_notipostcomment': ' đã bình luận bài viết của bạn.',
            'content_notipostreply': ' đã phản hồi bình luận của bạn.',
            'content_notiblog': ' đã bình luận bài tin tức của bạn.',
            'content_notiprojectapply': ' đã nộp đơn cho dự án của bạn.',
            'content_notiprojectinvite': ' đã mời bạn tham gia dự án.',

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