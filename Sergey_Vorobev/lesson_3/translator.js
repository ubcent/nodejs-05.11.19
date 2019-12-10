
const readline = require('readline');
const request = require('request');

const rl = readline.createInterface({
   input: process.stdin,
   output: process.stdout
});

const YANDEX_API_KEY = 'trnsl.1.1.20191201T142517Z.7d1439cf5dec9ca0.5fc5ddd886161aca19c5fdab4e2c665cfb457465';

new Promise((resolve) => {
    rl.question('Введите текст на русском: ', (inputText) => {
        rl.close();
        resolve(inputText);
    });
}).then((inputText) => {
    request({
        method: 'GET',
        uri: 'https://translate.yandex.net/api/v1.5/tr.json/translate',
        qs: {
            key: YANDEX_API_KEY,
            text: inputText,
            lang: 'ru-en',
        },
    }, (err, response, body) => {
        if (err || response.statusCode !== 200) {
            throw err;
        }

        const translation = JSON.parse(body);

        console.log('Перевод:', translation.text[0]);
    });
});