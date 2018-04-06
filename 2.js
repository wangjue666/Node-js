const url=require('url');
const gbk=require('gbk');
const JSDOM=require('jsdom').JSDOM;
function getUrl(sUrl,success,error){
    _req(sUrl)
    function _req(sUrl){
        let obj=url.parse(sUrl);
        let mod=null;
        if(obj.protocol=='http:'){
            mod=require('http');
        }else{
            mod=require('https');
        }
        let req=mod.request({
            hostname:obj.hostname,
            path:obj.path
        },res=>{
            if(res.statusCode==200){
                let arr=[];
                res.on('data',buffer=>{
                    arr.push(buffer);
                });
                res.on('end',()=>{
                    let b=Buffer.concat(arr);
                    //数据已经接收完了；
                    success && success(b);
                })
            }else if(res.statusCode==301||res.statusCode==302){
                _req(res.headers['location'])
            }else{
                console.log('出错了',res.statusCode)
                error && error();
            }
        });
        req.on('error',err=>{
            console.log('出错了',err)
            error && error(err)
        });
        req.end();
    }

};

getUrl('https://detail.tmall.com/item.htm?spm=a220m.1000858.1000725.1.605736135YeNjS&id=566802595043&skuId=3766591854551&areaId=140800&standard=1&user_id=1776456424&cat_id=2&is_b=1&rn=ea633cab60067c79fc9f344dff6cf3b6',buffer=>{
    let html=gbk.toString('utf-8',buffer);
    let DOM=new JSDOM(html);
    let document=DOM.window.document;
    let oH=document.querySelector('.tb-detail-hd h1 a');
    console.log(oH.innerHTML.replace(/^\s+|\s+$/g,''))
},()=>{
    console.log('出错楼')
})