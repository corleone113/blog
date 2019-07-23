import express from 'express';
import svgCaptcha from 'svg-captcha';
import {
    responseClient,
    md5,
    MD5_SUFFIX
} from '../../util';
import UserService from '../../service/user';
import {
    status
} from '../../constants';

const router = express.Router();

router.get('/captcha', (req, res) => {
    const captObj = svgCaptcha.create();
    req.session.captcha = captObj.text;
    res.set({
        'Content-Type': 'image/svg+xml',
    })
    responseClient(res, 200, 0, '请求成功', captObj.data);
});

router.post('/signup', (req, res) => {
    const {
        aggrement,
        prefix,
        phone,
        address,
        repassword,
        captcha,
        ...user
    } = req.body;
    if (aggrement !== 'true') {
        return responseClient(res, 203, 1, '请同意协议再注册!', '');
    }
    if (user.password !== repassword) {
        return responseClient(res, 203, 1, '密码和确认密码不一致!', '');
    }
    console.log(captcha, req.session.captcha);
    if (!captcha || !req.session.captcha || captcha.toLowerCase() !== req.session.captcha.toLowerCase()) {
        return responseClient(res, 203, 1, '验证码不正确或已过期!', '');
    }
    user.password = md5(user.password + MD5_SUFFIX);
    user.phone = prefix + '-' + phone;
    user.address = address.split(',').join('-');
    new UserService(user, {
        username: user.username
    }).create(result => {
        switch (result.status) {
            case status.SUCCESS:
                return responseClient(res, 200, 0, '注册成功!', result.data);
            case status.EXISTED:
                return responseClient(res, 203, 1, '该用户已注册!', result.data);
            case status.QUERY_ERROR:
                return responseClient(res);
        }
    })
});

export default router