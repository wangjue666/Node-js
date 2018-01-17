var fs=require('fs');
var projectData={
    'name':'wangjue',
    'fileData':[
        {
            'name':'css',
            'type':'dir'
        },
        {
            'name':'img',
            'type':'dir'
        },
        {
            'name':'javascript',
            'type':'dir'
        },
        {
            'name':'index.html',
            'type':'File',
            'content':"<h1>初始化l222</h1>"
        },
    ]
};
if(projectData.name){
    fs.mkdirSync('FileSystem/'+projectData.name);
    var fileData=projectData.fileData;
    if(fileData&&fileData.forEach){
        fileData.forEach(function(f){
            f.path='FileSystem/'+projectData.name+'/'+f.name;
            switch(f.type){
                case 'dir':
                    fs.mkdirSync(f.path);
                    break;
                case 'File':
                    fs.writeFileSync(f.path,f.content);
                    break;
                default:
                    break;
            }
        })
    }
}