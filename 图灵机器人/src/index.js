let color=require('./color');
let readline=require('readline');
var http=require('http');
const apiKey='9301a4ac727e4db7b156f83527122fbb';
const RESPONSE_TYPE = {
    TEXT: 100000,
    LINK: 200000,
    NEWS: 302000
}
function welcome(){
    let welcomeMsg='请开始你的表演';
    // for(let i=0;i<welcomeMsg.length;i++){
    //     color.colorLog('----------',welcomeMsg.charAt(i),'----------');
    // }
    Array.prototype.forEach.call(welcomeMsg,(it)=>{
        color.colorLog('----------',it,'----------');
    })
};
welcome();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let name='';
rl.question('> 阁下尊姓大名:',(answer)=>{
    name=answer;
    color.colorLog('客官请提问');
    chat();
});
function chat() {
    rl.question('> 请输入你的问题: ', (query)=>{
      if(!query) {
        color.colorLog('客官请慢走');
        process.exit(0);
      }
    let req = http.request({
        hostname: 'www.tuling123.com',
        path: '/openapi/api',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
    });
    res.on('end', () => {
        color.colorLog(handleResponse(data));
        chat();
    })
    });

        req.write(JSON.stringify({
            key: apiKey,
            info: query,
            userid: name
        }));

        req.end();
    });
    function handleResponse(data) {
        let res = JSON.parse(data);
        switch(res.code) {
            case RESPONSE_TYPE.TEXT:
                return res.text;
            case RESPONSE_TYPE.LINK:
                return `${res.text} : ${res.url}`;
            case RESPONSE_TYPE.NEWS:
                let listInfo = '';
                (res.list || []).forEach((it) => {
                    listInfo += `\n文章: ${it.article}\n来源: ${it.source}\n链接: ${it.detailurl}`;
        });
        return `${res.text}\n${listInfo}`;
    default:
        return res.text;
    }
    }
}