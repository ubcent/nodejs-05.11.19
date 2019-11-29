const request = require('request');
const cheerio = require('cheerio');
const colors = require('colors');
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

// const news = {};



app.get('/:news', (req, res) => {
    res.render('news');
})

app.post('/responseNews', (req, res) => {
    request('https://www.cbc.ca/news', (err, res, body) => {
        if (!err && res.statusCode == 200) {
            const $ = cheerio.load(body);
            let i = 0;
            let newsArray = [];
            while (i < 6) {
                let headerNews = $('.headline').eq(i).text();
                let bodyNews = $('.description').eq(i).text();
                newsArray.push({ 'headerNews': headerNews, 'bodynews': bodyNews });
                i++;
            } 
            console.log(newsArray);
        }
    });
})

