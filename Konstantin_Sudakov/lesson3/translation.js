//Модули для работы
const readline = require('readline');
const https = require('https');
const clc = require("cli-color");

//сам код
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Что перевести с английского?');
rl.on('line', (word) => {

  const translatePromise = new Promise((resolve, reject) => {
    https.get('https://translate.yandex.net/api/v1.5/tr.json/translate' +
      '?key=trnsl.1.1.20191123T142519Z.9959685fb71b1c8a.409ec1c5c4683a0725d6058f76533f55bb77c17d' +
      '&lang=en-ru&text='+word, (res) => {
      res.on('data', (data) => {
        resolve(data);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });

  translatePromise
    .then((data) => {
      let answer = JSON.parse(data);
      console.log(clc.green(...answer.text));
      console.log(clc.red('Может еще что-нибудь перевести?'));
    })
    .catch(
      (err) => {
        console.log('Error' + err);
        rl.close();
      }
    );

  if(word === '0') {
    rl.close();
  }
});



