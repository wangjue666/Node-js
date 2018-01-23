const express=require('express');
const expressStatic=require('express-static');

var server=express();
server.listen(8080);

//用户数据
var users={
    'wg':'1234',
    'wl':4321
};
server.get('/login',function(req,res){
    console.log(req.query)
    var user=req.query['user'];
    var pass=req.query['pass'];
    console.log(pass)
    if(users[user]==null){
        res.send({ok:false,msg:'此用户不存在'});
    }else{
        if(users[user]!=pass){
            res.send({ok:false,msg:'此用户密码不正确'});
        }else{
            res.send({ok:true,msg:'登录成功'});
        }
    }
})

server.use(expressStatic('./www'))