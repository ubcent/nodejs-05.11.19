//модули для работы
const request = require('request');
const cheerio = require('cheerio');
const clc = require("cli-color");

countNews = 10;//количество новостей

//рабочий код

const promiseNews = new Promise((resolve, reject) => {
    request('https://ria.ru/', (err, res, body) => {
        if (!err && res.statusCode === 200){
            resolve(body);
        }else {
            reject(err);
        }
    });
});

promiseNews
    .then(
    (body) => {
        const $ = cheerio.load(body);
        for (let i = 0; i < countNews; i++) {
            let msg = clc.xterm(i);
            const news = $('.cell-list__item-title').eq(i).text();
            console.log(msg(news));
        }
        console.log('Сейчас еще с яндекса подкинем новостей');
        return new Promise((resolve, reject) => {
            request('https://yandex.ru/news', (err, res, body) => {
                if (!err && res.statusCode === 200){
                    resolve(body);
                }else {
                    reject(err);
                }
            });
        })
    })
    .then(
      (body) => {
          const $ = cheerio.load(body);
          for(let i = 0; i < countNews - 5; i++) {
              let msg = clc.xterm(i);
              const news = $('.story__title').eq(i).text();
              console.log(msg(news));
          }
          console.log(clc.green('Это были самые интересные новости к этому часу'))
      }
    )
    .catch(
      (err) => console.log(clc.red('Упс...что-то пошло не так \n' +  err))
    );


console.log('Постигаю асинхронщину. Этот код написан после запросов,но выходит в консоле раньше. Начинаю понимать промисы и мне это нравится');
console.log('Сейчас узнаем что происходит в мире');


