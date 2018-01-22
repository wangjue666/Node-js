const http=require('http');
const fs=require('fs');
const urlLib=require('url');
const querystring=require('querystring');

var users={};
var server=http.createServer(function(req,res){
    //解析数据
    var str='';
    req.on('data',function(data){
        str+=data;
    })
    req.on('end',function(){
        var obj=urlLib.parse(req.url,true);
        const url=obj.pathname;
        const GET=obj.query;
        const POST=querystring.parse(str);
        console.log(url,GET,POST);
        if(url=='/user'){
            switch(GET.act){
                case 'reg':
                    if(users[GET.user]){
                        res.write('{"ok":false,"msg":"此用户已存在"}');
                    }else{
                        users[GET.user]=GET.pass;
                        res.write('{"ok":true,"msg":"注册成功"}');
                    }
                    break;
                case 'login':
                    if(users[GET.user]==undefined){
                        res.write('{"ok":false,"msg":"此用户不存在"}');
                    }else if(users[GET.user]!=GET.pass){
                        res.write('{"ok":false,"msg":"用户名或密码有误"}');
                    }else{
                        res.write('{"ok":true,"msg":"登陆成功"}');
                    }
                    break;
                default:
                    res.write('{"ok":false,"msg":"未知的act"}');

            }
            res.end();
        }else{
            var file_name='HTTP//www'+url;
            fs.readFile(file_name,function(err,data){
                if(err){
                    res.write('404');
                    console.log(file_name);
                }else{
                    res.write(data);
                }

                res.end();
            });
        }

    })
});
server.listen(8080);