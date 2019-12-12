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

    if (res.statusCode === 200) {
        const {count = 10, source = yandexNews} = req.body;

        if (source === 'yandexNews') {
            const body = await requestPromise('https://yandex.ru/news');
            const $ = cheerio.load(body);
            const newsFull = [];
            const stories = $('.stories-set__item');
            stories.each((i, item) => {
               newsFull.push({
                   'date': $(item).find('.story__date').text(),
                   'text': $(item).find('.link').text(),
               });

            });
            const news = newsFull.slice(0, count);
            res.render('news', {
                news
            })

        } else if (source === 'bash') {
            const body = await requestPromise('https://bash.im');
            const $ = cheerio.load(body);
            const newsFull = [];
            const quote = $('.quote__frame');
            quote.each((i, item) => {
                newsFull.push({
                    'link': 'bash.im' + $(item).find('.quote__header_permalink').attr('href'),
                    'date': $(item).find('.quote__header_date').text(),
                    'text': $(item).find('.quote__body').text()
                });
            });
            const  news = newsFull.slice(0, count);
            //console.log(news);
            res.render('news', {
                news
            })
        } else {
            res.render('news', {
                err: 'Такой источник не поддерживается'
            });
        }
    }
});


app.listen(3000, () => {
    console.log('Сервер запущен на 3000');
});
