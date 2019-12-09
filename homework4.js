const express = require('express');
const consolidate = require('consolidate');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');
const { promisify } = require('util');

const promisifiedRequest = promisify(request);

const app = express();

app.use(express.urlencoded({ extended: false }));

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.get('/news', (req, res) => {
  res.render('news');
});

app.post('/news', async (req, res) => {
  const { count = 10, source = 'bash' } = req.body;

  if (source === 'ria') {
    // TODO
  } else if (source === 'bash') {
    const { body } = await promisifiedRequest('https://bash.im');
    const $ = cheerio.load(body);

    const news = Array.prototype.slice.call($('.quote__body').map((_, element) => $(element).text()), 0, count);

    res.render('news', { news })
  } else {
    res.render('news', {
      err: 'Такой источник не поддерживается',
    });
  }
});

app.listen(3000, () => {
  console.log('Server has been started!');
});