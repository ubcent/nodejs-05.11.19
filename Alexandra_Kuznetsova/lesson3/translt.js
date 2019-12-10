const url = require('url');
const request = require('request');
const readline = require('readline');
const color = require('colors');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//  разбиваем URL на части
let params = url.parse(
  'https://translate.yandex.net/api/v1.5/tr.json/translate?key={сюда-подставитьключ}&lang=ru-en', true
);

//  удаляем ненужные части
delete params.search;

//  собираем URL с заменой параметров и добавляем ввод текста в консоли
function translate(lang) {
  console.log(`Введите текст для перевода (${lang}): `.green);
  rl.on('line', function (cmd) {
    if ( cmd === 'q' ) {
      rl.close();
    } else {
      params.query = {
        key: 'trnsl.1.1.20191122T190531Z.0b7d81cf2ea5abe7.b914758541eb96ca6f7978f2b3e4d9e05673aa25',
        lang: lang,
        text: cmd
      }
    const getUrl = url.format(params); //  получаем URL с текстом для GET запроса
    request(getUrl, (err, res, body) => {
      if ( !err && res.statusCode === 200 ) {
        let data = JSON.parse(body);  //  парсим JSON
        console.log(data.text[0].yellow); //  выводим ответ желтым
      }
    });
    }
  });
}

translate('ru-en');