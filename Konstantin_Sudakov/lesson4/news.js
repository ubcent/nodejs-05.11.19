// модули для работы
const express = require('express');
const consolidate = require('consolidate');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');
const clc = require("cli-color");
const cookieParser = require('cookie-parser');

// создал приложение
const app = express();

// задал настройки для приложения
app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// функция с промисом. принимает адрес сайта
const getNews = (url) => {
  return promiseNews = new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      if (!err && res.statusCode === 200) {
        resolve(body);
      } else {
        reject(err);
      }
    });
  });
};

app.get('/', (req, res) => {
  res.render('newspaper');
});

app.post('/getnews', (req, res) => {
// определяю переменые
  let url;
  let classOfNews;
  let newsCount;
  switch (req.body.site) {
    case 'РИА новости':
      url = 'https://ria.ru/';
      classOfNews = '.cell-list__item-title';
      break;
    case 'Яндекс новости':
      url = 'https://yandex.ru/news';
      classOfNews = '.story__title';
      break;
  }
  if (req.body.count > 20) {
    newsCount = 20;
  } else {
    newsCount = req.body.count;
  }
  // вызываю промис
  getNews(url);
  // обрабатываю результаты промиса
  promiseNews
    .then(
      (body) => {
        const arrNews = [];
        const $ = cheerio.load(body);
        for (let i = 0; i < newsCount; i++) {
          const news = $(classOfNews).eq(i).text();
          arrNews.push(news);
        }
        res.render('newspaper', {arrNews});
      })
    .catch(
      (err) => console.log(clc.red('Упс...что-то пошло не так \n' + err))
    );
});

app.listen(3000, () => {
  console.log('Server has been started!');
});