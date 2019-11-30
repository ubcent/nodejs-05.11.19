const request = require('request');
const http = require('http');
const utils = require('url');
const key = 'trnsl.1.1.20191126T125051Z.74ff8f21a927eb58.60f89ceaebdff25e86ebe49d0b5918a1bc7122a6';

async function translate(str) {
    const queryurl = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=' + key + '&text=' + str + '&lang=en-ru';
    
    let promise = new Promise((resolve, reject) => {
        request({url: queryurl, json: true}, (err, res, body) => {
            if (!err && res.statusCode === 200) {
                resolve(body.text[0]);
            } else {
                resolve(err);
            }
        });  
    });
    
    let rus = await promise;
    console.log(rus);
};

http.createServer((req, res) => {
    const query = utils.parse(req.url, true);  
    const textTranslate = query.query.textTr;
    
    if (textTranslate) {
        translate(textTranslate); 
    }; 
    
    res.end();
}).listen(3000);