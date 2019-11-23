const request = require('request');
const cheerio = require('cheerio');

request('https://www.banki.ru/products/currency/cash/usd/sankt-peterburg/', (err, res, body) => {
  if (!err && res.statusCode === 200) {
    const $ = cheerio.load(body);

    const usd = $('.currency-table__rate .currency-table__large-text').eq(0).text();

    console.log('Курс доллара', usd);
  }
});