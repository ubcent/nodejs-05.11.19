const express = require('express');
const consolidate = require('consolidate');
const path = require('path');
const rp = require('request-promise');
const cheerio = require('cheerio');

const app = express();

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/', async (req, res) => {
  const news = await getNews(req.body.portal, req.body.count);
  res.render('index', { news });
});

app.listen(3000, () => {
  console.log('Server has been started');
});

const PORTALS_DATA = {
  vesti: {
    host: 'https://www.vesti.ru',
    newsUrl: 'https://www.vesti.ru/news',
    newsSelector: '.b-item__info',
    dateSelector: '.b-item__time',
    titleSelector: '.b-item__title a',
    linkSelector: '.b-item__title a',
  },
  svoboda: {
    host: 'https://www.svoboda.org',
    newsUrl: 'https://www.svoboda.org/news',
    newsSelector: '#ordinaryItems li',
    dateSelector: '.content span.date',
    titleSelector: '.content .media-block__title span.title',
    linkSelector: 'a.img-wrap',
  },
  svpressa: {
    host: 'https://svpressa.ru',
    newsUrl: 'https://svpressa.ru/all/news',
    newsSelector: '.b-article.b-article_item',
    dateSelector: '.b-article__date',
    titleSelector: '.b-article__title.b-article__title_item',
    linkSelector: '.b-article__title.b-article__title_item',
  },
};

async function getNews(portal, count) {
  const data = PORTALS_DATA[portal];
  const result = [];

  const $ = await rp({
    uri: data.newsUrl,
    transform: function (body) {
      return cheerio.load(body);
    }
  });

  const news = $(data.newsSelector);
  const slicedNews = news.slice(0, +count);

  slicedNews.each((i, item) => {
    result.push({
      date: $(item).find(data.dateSelector).text(),
      title: $(item).find(data.titleSelector).text(),
      link: `${data.host}${$(item).find(data.linkSelector).attr('href')}`,
    });
  });

  return result;
}
