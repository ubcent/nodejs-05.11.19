const request = require('request');
const cheerio = require('cheerio');
const colors = require('colors');

request('https://www.cbc.ca/news', (err, res, body) => {
    if (!err && res.statusCode == 200) {
        const $ = cheerio.load(body);
        let i = 0;
        console.log('...............................');
        console.log('CANADA NEWS')
        while (i < 6) {
            let headerNews = $('.headline').eq(i).text();
            let bodyNews = $('.description').eq(i).text();
            i++;
            console.log('...............................');
            console.log(headerNews.red);
            console.log(bodyNews.green);
        }
    }
})