const request=require('request');
const fs=require('fs');
const xlsx=require('node-xlsx');
let path='./chengyu.xlsx';
let obj=xlsx.parse(path);
let excelObj=obj[0].data;
let num=0;
let starArr=[];

function crawl(num){
    let api=`http://qianxun.baidu.com/seagull/aj/list_loadmore?sid=Nesaj4oFmDn700YxlaXTPA%3D%3D&type=28266&pageNum=${num}&latitude=0&longitude=0`;
    console.log(api)
    request(api,(err,response,body)=>{
        let data=JSON.parse(body).data.list;
        for(let i=0;i<data.length;i++){
            let obj={};
            obj.title=data[i].cardInfo.title;
            obj.pic=data[i].cardInfo.pic;
            obj.summary=data[i].cardInfo.summary.substring(0,data[i].cardInfo.summary.indexOf('。'));
            starArr.push(obj);
        }
        num=num+1;
        if(num>=20){
            for(let j=0;j<=200;j++){
                obj[0].data[j][0]=starArr[j].title;
                obj[0].data[j][1]=starArr[j].pic;
                obj[0].data[j][2]=starArr[j].summary;
            }
            var buffer = xlsx.build([{name: "mySheetName", data:obj[0].data}])
            fs.writeFileSync('./mingxing.xlsx',buffer,'binary')
            return
        }else{

            crawl(num);
        }

    })
}
crawl(num);
