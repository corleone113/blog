import express from 'express';
import svgCaptcha from 'svg-captcha';
import {
    responseClient
} from '../../util';

const router = express.Router();

router.get('/captcha', (req, res) => {
    const captObj = svgCaptcha.create();
    req.session.captcha = captObj.text;
    res.set({
        'Content-Type': 'image/svg+xml'
    })
    responseClient(res, 200, 0, '请求成功', captObj.data);
});

router.post('/signup', (req, res) => {
    console.log('req body:', req.body, req.session);
    responseClient(res, 200, 0, '正在注册测试！', '注册测试');
})

export default router