const readline = require('readline');
const request = require('request');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const key = 'trnsl.1.1.20191126T125051Z.74ff8f21a927eb58.60f89ceaebdff25e86ebe49d0b5918a1bc7122a6';

console.log('Введите строку En и получите перевод: ');

rl.on('line', function (str) {
    const query = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key=' + key + '&text=' + str + '&lang=en-ru';
    request({url: query, json: true}, (err, res, body) => {
        if (!err && res.statusCode === 200) {
            console.log('Ru: ' + body.text[0]);
        } else {
            console.log(err);
        }
    });
});