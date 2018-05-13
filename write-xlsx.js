const fs=require('fs');
const xlsx=require('node-xlsx');
let path='./chengyu.xlsx';
let obj=xlsx.parse(path);
let excelObj=obj[0].data;
let arr=[];
for(let i=0;i<obj[0].data.length;i++){
    obj[0].data[i][2]='test'
};
console.log( obj[0].data[1])
var buffer = xlsx.build([{name: "mySheetName", data:obj[0].data}])

fs.writeFileSync('./chengyu2.xlsx',buffer,'binary')
