const express = require('express');
const cheerio = require('cheerio');
const path = require('path');
const consolidate = require('consolidate');
const requestPromise = require('request-promise');


const app = express();

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.get('/', (reg, res) => {
   res.render('news');
});

app.post('/', async (req, res) => {
    const {count = 10, source = yandexNews} = req.body;

    if (source === 'yandexNews') {

    } else if (source === 'bash') {
        const body  = await requestPromise('https://bash.im');
        const $ = cheerio.load(body);
        const news = new Map();
        const quote = $('.quote__frame');
        quote.each((i, item) => {
                news.set('link',($(item).find('.quote__header_permalink').attr('href')));
                news.set('date',($(item).find('.quote__header_date').text()));
                news.set('text',($(item).find('.quote__body').text()));
        });
       // console.log(news);
        res.render('news', {
            news
        })
    } else {
        res.render('news', {
            err: 'Такой источник не поддерживается'
        });
    }
});


app.listen(3030, () => {
    console.log('Сервер запущен');
});
