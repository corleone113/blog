const express=require('express');
const router=express.Router();
const app=express();
router.get('/aa',(req,res)=>{
    console.log('get request...',req.body);
    res.send('hello corleone');
});
app.use('/',router);
app.listen('6665',function (err) {
    if (err) {
        console.error('err:', err);
    } else {
        console.info(`===> api server is running at http://localhost:6665`)
    }
})
    