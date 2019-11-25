// Создать программу для получения информации о последних новостей с выбранного вами сайта в структурированном виде.
const request = require('request');
const iconv = require('iconv-lite');
const cheerio = require('cheerio');

request({ 
    uri: 'https://www.fontanka.ru/',
    method: 'GET',
    encoding: null
    }, (err, response, body) => {
    if (!err && response.statusCode == 200) {
        const strBody = iconv.decode(body, 'win1251');
        const $ = cheerio.load(strBody);
        
        $('.sb-item__title').each((index) => {
            // Не понимаю, почему не выводит текст элемента?
            console.log(`${index}: ${$(this).text()}`);
            // А вот так работает
            console.log($('.sb-item__title').eq(index).text());
        });
    };
});