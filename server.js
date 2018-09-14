const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const fs=require('fs');
const zlib=require('zlib');
let db=mysql.createPool({
    host:'localhost',
    user:'root',
    password:'123456',
    database:'message',
    connectionLimit:10
});
let app=express();
app.listen(8080);
app.all('*',(req,res,next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Content-Type','application/json;charset=utf-8');
    next();
});

app.use(bodyParser.urlencoded({
    extended:true,
    limit:1024
}));

app.post('/sendMessage',(req,res)=>{
     let {sender_id,receive_id,message_type,message_content}=req.body;
     let send_time=new Date().valueOf();
     console.log(message_content);
     let sql=`INSERT INTO message_data (user_id,friend_id,sender_id,receive_id,message_type,message_content,send_time) VALUES
       ('${sender_id}','${receive_id}','${sender_id}','${receive_id}','${message_type}','${message_content}','${send_time}'),
       ('${receive_id}','${sender_id}','${sender_id}','${receive_id}','${message_type}','${message_content}','${send_time}')
     `
     db.query(sql,(err,data)=>{
          if(err){
              res.send({code:1,msg:'数据存储失败',err:err});
          }else{
              res.send({code:0,msg:'数据存储成功'});
          }
          res.end();
     })

})
app.get('/getMyMessList',(req,res)=>{
    console.log('overhere')
    let openId=req.query.openId;
   // let sql=`SELECT * FROM message_data WHERE user_id = '${openId}' GROUP BY friend_id `

    let sql2=`SELECT * FROM (SELECT friend_id,user_id,message_content,send_time,name,img FROM message_data m,user_data u WHERE m.friend_id=u.openid  GROUP BY m.id DESC) message_data WHERE user_id='${openId}' GROUP BY friend_id DESC`


    db.query(sql2,(err,data)=>{

        res.send(data);
        res.end();
    })
});
app.get('/getConversatiomDetail',(req,res)=>{
    let openId=req.query.openId;
    let friendId=req.query.friendId;
    let sql=`SELECT sender_id,receive_id,send_time,message_content FROM message_data WHERE user_id='${openId}' AND friend_id='${friendId}'`
    db.query(sql,(err,data)=>{
        console.log(data);
        res.send(data);
        res.end();
    })
})