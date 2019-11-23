const request = require('request');
const cheerio = require('cheerio');
const minimist = require('minimist');
const argv = minimist(process.argv.slice(2))

const host = 'https://www.vesti.ru';
const newsQuantity = argv.q || 10;

request(`${host}/news`, (err, res, body) => {
  if (!err && res.statusCode === 200) {
    const $ = cheerio.load(body);

    const news = $('.b-item__info');
    const slicedNews = news.slice(0, +newsQuantity);

    slicedNews.each((i, item) => {
      const date = $(item).find('.b-item__time').text();
      const title = $(item).find('.b-item__title a').text();
      const link = $(item).find('.b-item__title a').attr('href');

      console.log('Дата и время: ', date);
      console.log('Заголовок: ', title);
      console.log('Ссылка: ', `${host}${link}`);
      console.log('\n', '-------------------', '\n');
    });
  }
});