var fs=require('fs');
var fileDir='source';
fs.watch(fileDir,function(ev,file){
   // console.log(ev+'/'+file)
    fs.readdir(fileDir,function(err,datalist){
        var arr=[];
        datalist.forEach(function(f){
            var info=fs.statSync(fileDir+'/'+f);
            if(info.mode==33206){
                arr.push(fileDir+'/'+f);
            }
        });
        //console.log(arr);
        var content='';
        arr.forEach(function(f){
            if(f){
                var c=fs.readFileSync(f);
                content+=c.toString()+'\n';
            };
        });
        console.log(content);
        fs.writeFile('index.js',content);
    })
})