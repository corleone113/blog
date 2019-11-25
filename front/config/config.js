module.exports = {
    host: 'localhost',
    port: process.env.NODE_ENV === 'production' ? 80 : 3566,// 端口号
    apiHost: '192.168.101.102', //这里需要改成自己的服务器ip地址
    apiPort: '2333', //服务器端口
};