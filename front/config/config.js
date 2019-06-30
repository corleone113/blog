module.exports={
    host:process.env.NODE_ENV=='production'?'192.168.1.107':'localhost',
    port:process.env.NODE_ENV=='production'?8888:3288,
}