//trnsl.1.1.20191125T123652Z.d7459e4a8a37e2df.09b9a25e1d9e9520147193633f2204ee76ecb7f8
const readline = require('readline');
const request = require('request');

const key = 'trnsl.1.1.20191125T123652Z.d7459e4a8a37e2df.09b9a25e1d9e9520147193633f2204ee76ecb7f8';
const land = 'en-ru';

console.log("Введите слово или фразу на английском языке. Для выхода q");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.on('line', (cmd) => {
    if (cmd === '')
        return;
    
    if(cmd === 'q') {
        rl.close();
        return;
    }

    const url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${key}&lang=${land}&text=${cmd}`;
    request.get(url, (err, response, body) => {
        if (!err && response.statusCode == 200) {
            console.log(JSON.parse(body).text[0]);
        }
    });
});