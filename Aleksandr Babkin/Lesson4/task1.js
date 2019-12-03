const request = require('request');
const cheerio = require('cheerio');
const express = require('express');
const consolidate = require('consolidate');
const path = require('path');

const app = express();

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.listen(3000, () => {
    console.log('Server is starting!')
})

app.get('/news', (req, res) => {
    res.render('news');
})

app.post('/newsQueryResult', (req, res) => {
    let newsArray = [];
    request('https://www.cbc.ca/news', (err, res, body) => {

        if (!err && res.statusCode == 200) {

            const $ = cheerio.load(body);
            let i = 0;

            while (i < req.body.count) {
                let headerNews = $('.headline').eq(i).text();
                let bodyNews = $('.description').eq(i).text();
                let visibleNews = true;
                newsArray.push({ 'headerNews': headerNews, 'bodyNews': bodyNews, 'visibleNews': visibleNews });
                i++;
            }
        }
    });

    setTimeout(() => {
        res.render('news', { newsArray });
    }, 8000);
})