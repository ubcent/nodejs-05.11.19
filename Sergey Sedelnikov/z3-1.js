const request = require('request');
const cheerio = require('cheerio');

request('https://www.e1.ru/news/', (err, res, body) => {
    if (!err && res.statusCode === 200) {
        const $ = cheerio.load(body);

        const messages = $('.KTcd');
    
        for(var i = 0; i < messages.length; i++) {
            console.log(i + 1 + ') ' + messages.eq(i).text() + '\n');        
        } 
    }
});