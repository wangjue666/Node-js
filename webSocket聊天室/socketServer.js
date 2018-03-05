const http=require('http');
const fs=require('fs');
const mysql=require('mysql');
const io=require('socket.io');
const regs=require('./lib/reg');

let db=mysql.createPool({
    host:'localhost',
    user:'root',
    password:'123456',
    database:'20180304'
});
let httpServer=http.createServer((req,res)=>{
    fs.readFile(`www/${req.url}`,(err,data)=>{
        if(err){
            res.writeHeader(404);
            res.write('not found');
        }else{
            res.write(data);
        }
        res.end();
    })
}).listen(8080);
let sArr=[];
//socket服务器
let wsServer=io.listen(httpServer);
wsServer.on('connection',sock=>{
    let cur_name='';
    let cur_id=0;
    sArr.push(sock);
    //注册
    sock.on('reg',(user,pass)=>{
        if(!regs.user.test(user)){
            sock.emit('reg_ret',1,'用户名不符合规范');
        }else if(!regs.pass.test(pass)){
            sock.emit('reg_ret',1,'密码不符合规范');
        }else{
            db.query(`SELECT id FROM user_table WHERE username='${user}'`,(err,data)=>{
                if(err){
                    sock.emit('reg_ret',1,'数据库有错了');
                }else{
                    if(data.length>0){
                        sock.emit('reg_ret',1,'此用户已经存在');
                    }else{
                        db.query(`INSERT INTO user_table (username,password,online) VALUES('${user}','${pass}',0)`,err=>{
                            if(err){
                               sock.emit('reg_ret',1,'数据库出错了。');
                            }else{
                               sock.emit('reg_ret',0,'注册成功');
                            }

                        })
                    }
                }
            })
        }
    });
    //登录
    sock.on('login',(user,pass)=>{
        if(!regs.user.test(user)){
            sock.emit('login_ret',1,'用户名不符合规范');
        }else if(!regs.pass.test(pass)){
            sock.emit('login_ret',1,'密码不符合规范');
        }else{
            db.query(`SELECT id,password FROM user_table WHERE username='${user}'`,(err,data)=>{
                if(err){
                    sock.emit('login_ret',1,'数据库出错了');
                }else if(data.length==0){
                    sock.emit('login_ret',1,'账号不存在');
                }else if(data[0].password!=pass){
                    sock.emit('login_ret',1,'密码有误');
                }else{
                    db.query(`UPDATE user_table SET online=1 WHERE id='${data[0].id}'`,err=>{
                        if(err){
                            sock.emit('login_ret',1,'读取数据出错了');
                        }else{
                            sock.emit('login_ret',0,'登录成功');
                            cur_name=user;
                            cur_id=data[0].id;
                        }
                    })
                }
            })
        }
    });
    //发消息
    sock.on('msg',(txt)=>{
        if(!txt){
            sock.emit('msg_ret',1,'消息不可为空');
        }else{
            //发消息给所有人
            sArr.forEach(item=>{
                if(item==sock) return;
                item.emit('msg',cur_name,txt);
            })
            sock.emit('msg_ret',0,'消息发送成功')
        }
    })
    //离线
    sock.on('disconnect',function(){
        db.query(`UPDATE user_table SET online=0 WHERE id='${cur_id}'`,err=>{
            if(err){
              console.log('数据库出错了'+err);
            }
              cur_id=0;
              cur_name='';
              sArr=sArr.filter(item=>item!=sock);

        })
    })
})