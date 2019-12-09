const express     = require('express');
const consolidate = require('consolidate');
const path        = require('path');
const request     = require('request');
const cheerio     = require('cheerio');
const app         = express();

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
class NewsAdd {
  constructor(title, text) {
    this.title = title;
    this.text = text;
  }
}

// функция добавления новостей
let getNews = (name, url, contentId, cntBefore, titleId, textId, count) => {
  request(url, (err, res, body) => {
    if ( !err && res.statusCode === 200 ) {
      const $ = cheerio.load(body);
      $(contentId).each(function(){
        name.data = [];
        for ( let i = 1; i <= count; i++ ) {
          let oneTitle = $(this).find(cntBefore + i + titleId).eq(0).text();
          let oneText = $(this).find(cntBefore + i + textId).eq(0).text();
          name.data.push(new NewsAdd(oneTitle, oneText));
        }
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
    return;
  }
}

// рендерим страницу
app.get('/', (req, res) => {
  res.render('web');
});

// получаем данные из формы и запускаем функцию для добавления новостей по выбранным параметрам
app.post('/news', (req, res) => {
  choice(req.body.name, req.body.count);
  res.render('web', req.body);
});

// рендерим страницу с новостями выбранного источника
app.get('/news', (req, res) => {
  const data = news[req.query.name];
  if( data == undefined ) {
    let message = { message: 'Page not found' };
    res.render('web', JSON.parse(JSON.stringify(message)));
  } else {
    res.render('web', data);
  }
});

app.listen(3000, () => {
  console.log('Server has been started!');
});
