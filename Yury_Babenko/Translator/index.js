const readline = require('readline');
const request = require('request');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const YANDEX_API_KEY = 'trnsl.1.1.20191123T152516Z.2330ec5bef438d4e.03083c097d14eb4f771fc154259d005119c1b29b';

new Promise((resolve) => {
  rl.question('Введите текст на английском для перевода: ', (inputedText) => {
    rl.close();
    resolve(inputedText);
  });
}).then((inputedText) => {
  request({
    method: 'GET',
    uri: 'https://translate.yandex.net/api/v1.5/tr.json/translate',
    qs: {
      key: YANDEX_API_KEY,
      text: inputedText,
      lang: 'en-ru',
    },
  }, (err, response, body) => {
    if (err || response.statusCode !== 200) {
      throw err;
    }

    const translation = JSON.parse(body).text[0];

    console.log('Перевод:', translation);
  });
})
