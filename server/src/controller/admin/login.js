import express from 'express';
import svgCaptcha from 'svg-captcha';
import {
    sign,
} from 'jsonwebtoken';
import {
    responseClient,
    sha2,
    SHA2_SUFFIX,
} from '../../util';
import userService from '../../service/user';
import roleService from '../../service/role';
import resourceService from '../../service/resource';
import config from '../../../config';
import {
    status,
} from '../../constants';

const router = express.Router();


router.get('/captcha', (req, res) => {
    const captObj = svgCaptcha.create();
    req.session.captcha = captObj.text;
    res.set({
        'Content-Type': 'image/svg+xml',
    });
    responseClient(res, 200, 0, '请求成功', captObj.data);
});
const getMenuAndSign = async (req, res, user) => {
    try {
        if (user.role === '')
            return responseClient(res, 203, 1, '该用户没有分配角色!', null);
        const result = await roleService.findAll({
            name: user.role,
        });
        const resource_names = result[0].resources;
        let resources = [];
        for (let i = 0; i < resource_names.length; ++i) {
            resources.push(resourceService.findAll({
                name: resource_names[i],
            }));
        }
        resources = await Promise.all(resources);
        resources = resources.map(r => r[0]);
        user.menus = resourceService.getTrees(resources);
        req.session.secret = config.forSecret + new Date().toLocaleString();
        req.session.token = sign(user, req.session.secret);
        return user;
    } catch (err) {
        console.error('Account error:', err);
        return responseClient(res, 203, 1, '获取用户资源失败!', err);
    }
};
router.post('/signin', async (req, res) => {
    const {
        username,
        password,
        captcha,
    } = req.body;
    if (!captcha || !req.session.captcha || captcha.toLowerCase() !== req.session.captcha.toLowerCase()) {
        return responseClient(res, 200, 1, '验证码不正确或已过期!', '');
    }
    const result = await userService.findAll({
        username,
    });
    if (result.length === 1) {
        const user = result[0];
        if (sha2(password + SHA2_SUFFIX) === user.password) {
            delete user.password;
            const signedUser = await getMenuAndSign(req, res, user);
            if (!signedUser) return;
            return responseClient(res, 200, 0, '登录成功!', signedUser);
        }
    } else if (result.length > 1) {
        return responseClient(res, 200, 1, '用户状态异常!', null);
    }
    responseClient(res, 200, 1, '用户名或密码不正确', null);
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
        return responseClient(res, 200, 1, '请同意协议再注册!', '');
    }
    if (user.password !== repassword) {
        return responseClient(res, 200, 1, '密码和确认密码不一致!', '');
    }
    if (!captcha || !req.session.captcha || captcha.toLowerCase() !== req.session.captcha.toLowerCase()) {
        return responseClient(res, 200, 1, '验证码不正确或已过期!', '');
    }
    user.password = sha2(user.password + SHA2_SUFFIX);
    user.phone = prefix + '-' + phone;
    user.address = address.split(',').join('-');
    user.role = '博客管理员';
    userService.create(user, {
        username: user.username,
    }, async result => {
        switch (result.status) {
            case status.SUCCESS:
                const user = result.data;
                delete user.password;
                const signedUser = await getMenuAndSign(req, res, user);
                return responseClient(res, 200, 0, '注册成功!', signedUser);
            case status.EXISTED:
                return responseClient(res, 200, 1, '该用户已注册!', null);
            case status.QUERY_ERROR:
                return responseClient(res);
        }
    });
});

router.get('/logout', (req, res) => {
    if (!req.session.token) {
        responseClient(res, 200, 1, '会话过期且已退出!', 2);
    } else {
        delete req.session.token;
        responseClient(res, 200, 0, '退出成功!', 2);
    }
});

export default router;