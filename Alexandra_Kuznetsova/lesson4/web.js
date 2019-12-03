const express = require('express');
const hbs = require('hbs');
const url = require('url');
const consolidate = require('consolidate');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');
const app = express();
//const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

// объект новостных источников
const news = {
  hitech: {
    url: 'https://hi-tech.news/',
    contentId: '#dle-content',
    cntBefore: '#dle-content > div:nth-child(',
    titleId: ') > div > div.post-content > h2',
    textId: ') > div > div.post-content > div.the-excerpt',
    data: []
  },
  wek: {
    url: 'https://wek.ru/sport/',
    contentId: 'body > div.content.container > div.content__body',
    cntBefore: '#blocks > div:nth-child(',
    titleId: ') > a.postshort__title',
    textId: ') > div.postshort__text',
    data: []
  },
  bravica: {
    url: 'https://www.bravica.news/ru/',
    contentId: '#content',
    cntBefore: '#content > div.post > ul:nth-child(2) > li:nth-child(',
    titleId: ') > table > tbody > tr > td:nth-child(2) > span.tc',
    textId: ') > table > tbody > tr > td:nth-child(2) > p',
    data: []
  }
}

// конструктор объекта новостей
function NewsAdd(title, text) {
  this.title = title;
  this.text = text;
}

// функция добавления новостей
let getNews = (name, url, contentId, cntBefore, titleId, textId, count) => {
  request(url, (err, res, body) => {
    if ( !err && res.statusCode === 200 ) {
      const $ = cheerio.load(body);
      $(contentId).each(function(){
        for ( let i = 1; i <= count; i++ ) {
          let oneTitle = $(this).find(cntBefore + i + titleId).eq(0).text();
          let oneText = $(this).find(cntBefore + i + textId).eq(0).text();
          name.data.push(new NewsAdd(oneTitle, oneText));
        }
        console.log(name.data);
      });
    }
  });
}

// функция запуска для добавления новостей
let start = (name, count) => {
  getNews(name, name.url, name.contentId, name.cntBefore, name.titleId, name.textId, count);
}

// функция определяющая источник (новостной сайт)
let choice = (param, count) => {
  if ( param === 'hitech' ) {
    start(news.hitech, count);
  } else if ( param === 'wek' ) {
    start(news.wek, count);
  } else if ( param === 'bravica' ) {
    start(news.bravica, count);
  } else {
    return 'Page not found';
  }
}

// рендерим страницу
app.get('/news', (req, res) => {
  res.render('web');
});

// получаем данные из формы
app.post('/news', (req, res, next) => {
  res.render('web', req.body);
  next();
});

// запускаем функцию для добавления новостей по выбранным параметрам
app.use((req, res, next) => {
  choice(req.body.name, req.body.count);
  next();
});

app.use((req, res) => {
  let newsName = req.body.name;
  const data = news[newsName];
  console.log(data);
  //res.render('web', data);
});

// app.get('/news/:newsName', (req, res) => {
//   const data = news[req.params.newsName];
//   res.render('web', data);
// });

// Дальше пока у меня ничего не работает. еще разбираюсь

app.listen(3000, () => {
  console.log('Server has been started!');
});
