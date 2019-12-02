let request = require('request');
let readline = require('readline');
let colors = require('colors');

function requestWords() {
    let requestWords = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    requestWords.question('Введите слово или фразу для первода - '.red, answer => {
        requestWords.close();
        let encodeWordUri = encodeURI(answer);
        request(
            'https://translate.yandex.net/api/v1.5/tr.json/translate?key=trnsl.1.1.20191121T215614Z.c47c226d5cc74133.20f24c239e2488e008e6bdb17a976626c0a3ba8e&text=' + encodeWordUri + '&lang=ru-en',
            (err, res, body) => {
                if (!err && res.statusCode == 200) {
                    let obj = JSON.parse(body);
                    console.log('**************ПЕРЕВОД**************')
                    console.log(obj.text);
                }
            });
    })
}
console.log('Русско-Английский переводчик'.green);
requestWords();

