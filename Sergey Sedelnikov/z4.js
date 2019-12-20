const express = require('express');
const consolidate = require('consolidate'); 
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');

const app = express();
let news = [];

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'))

app.use(express.urlencoded({ extendet: false }));

app.use(express.json());

app.get('/', (req,res) => {
    res.render('news');
});

app.post('/newsEKB', (req,res) => {
    let url = 'https://www.e1.ru/news/';
    let count;
    
    if(req.body.count > 40)
        count = 40
    else
        count = req.body.count;
    
    switch (req.body.typeNews) {
        case 'Вcе подряд' :
            url = 'https://www.e1.ru/news/';
            break;
        case 'Авто' :
            url = 'https://www.e1.ru/news/?rubric=auto';
            break;
        case 'Бизнес' :
            url = 'https://www.e1.ru/news/?rubric=business';
            break;
        case 'Город' :
            url = 'https://www.e1.ru/news/?rubric=gorod';
            break;
        case 'Здоровье' :
            url = 'https://www.e1.ru/news/?rubric=health';
            break;
        case 'Наука' :
            url = 'https://www.e1.ru/news/?rubric=science';
            break;
        case 'Недвижимость' :
            url = 'https://www.e1.ru/news/?rubric=realty';
            break;
        case 'Политика' :
            url = 'https://www.e1.ru/news/?rubric=politics';
            break;
        case 'Спорт' :
            url = 'https://www.e1.ru/news/?rubric=sport';
            break;
    }
    
    promise = new Promise((resolve, reject) => {
        request(url, (err, res, body) => {
            if (!err && res.statusCode === 200) {
                resolve(body);
            } else {
                reject(err);
            }
        });
    });
   
    promise
    .then(
        (body) => {
            const newsarr = [];
            const $ = cheerio.load(body);
            for (let i = 0; i < count; i++) {   
                const ob = new Object();
                ob.news = $('.K3b3').eq(i).text();
                ob.date = $('.K3aar').eq(i).text();
                ob.type = $('.K3arx').eq(i).text();
                newsarr.push(ob);
            }
        res.render('news', {newsarr, count});
      })
});

app.listen(3000, () => {
    console.log('Server has been started.');
});