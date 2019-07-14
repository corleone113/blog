import crypto from 'crypto'

module.exports = {
    MD5_SUFFIX: 'fyosjdskfzjsdksnfkdfl.ker两只黄鹂鸣翠柳@#￥%……&^》》M',
    md5: function (pwd) {
        let md5 = crypto.createHash('md5');
        return md5.update(pwd).digest('hex')
    },
    responseClient(res, httpCode = 500, code = 3, message = '服务端异常', data = {}) {
        const responseData = {};
        const isSVG = res.get('Content-Type') === 'image/svg+xml';
        responseData.code = code;
        responseData.message = message;
        responseData.data = data;
        isSVG ? res.status(httpCode).send(data) : res.status(httpCode).json(responseData);
    }
}