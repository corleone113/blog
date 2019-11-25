export const homeBannerImages = [
    require('static/bannerImages/banner_slide_01.png'),
    require('static/bannerImages/banner_slide_02.png'),
    require('static/bannerImages/banner_slide_03.png'),
];
export const loginBannerImages = [
    require('static/bannerImages/banner_slide_01.jpg'),
    require('static/bannerImages/banner_slide_02.jpg'),
    require('static/bannerImages/banner_slide_03.jpg'),
    require('static/bannerImages/banner_slide_04.jpg'),
    require('static/bannerImages/banner_slide_05.jpg'),
];
export const excludeResources = [
    '权限管理',
    '博客管理',
];
export const manager = () => JSON.parse(sessionStorage.getItem('info')).username;