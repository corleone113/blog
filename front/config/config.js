module.exports = {
    host: process.env.NODE_ENV === 'production' ? '192.168.1.107' : 'localhost',
    port: process.env.NODE_ENV === 'production' ? 8888 : 3288,
    apiHost: '192.168.31.92',
    apiPort: '2333',
};