const express = require('express');
const consolidate = require('consolidate');
const path = require('path');
const request = require('request');
const iconv = require('iconv-lite');
const cheerio = require('cheerio');

const app = express();

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.urlencoded({extended: false}));


app.get('/', (req, res) => {
    res.render('news');
});

app.post('/settings', (req, res) => {
    request({ 
        uri: 'https://www.fontanka.ru/',
        method: 'GET',
        encoding: null
        }, (err, response, body) => {
        if (!err && response.statusCode == 200) {
            const strBody = iconv.decode(body, 'win1251');
            const $ = cheerio.load(strBody);
            const news = [];
            if (req.body.count > 0) {
                $('.sb-item__title').each(function(index) {
                    news.push($(this).text());
                });
                news.splice(req.body.count);
            }
            res.render('news', { news });
        } else {
            res.render('news', { error: 'Ошибка при получении новостей.'});
        }
    });
});

app.listen(3000, () => {
    console.log("Сервер запущен!")
});

function GetNews()
{

}