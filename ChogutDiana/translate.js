const readline = require('readline');
const cheerio = require('cheerio');
const request = require('request');
const http = require('http');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

http.createServer((req, res) => {
    
    let textToTranslate = rl.on('line', (word) => {
        return word;
    });

    let translatedText = '';

    request({
        method: 'GET',
        url: 'https://translate.yandex.net/api/v1.5/tr.json/translate',
        qs: {
        text: textToTranslate,
        key: 'trnsl.1.1.20191121T172005Z.1cf3a7a602a1c14c.8a9ed7614899fc3640530c8d9a3f74954a12d867',
        lang:'ru-en'
        }
        }, (err, response, body) => {
        if( !err && response.statusCode === 200){
            translatedText = body;
            console.log(translatedText);
        }
    });

    response.write(translatedText);
    response.end();

}).listen(8090);

// тут я както запуталась в логике, долго сидела, но пазл в голове как это должно в итоге быть так и не сложился




