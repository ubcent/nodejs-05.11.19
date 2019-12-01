
const request = require('request');
const cheerio = require('cheerio');

request('https://yandex.ru/news' ,(err, res, body) => {
    if (!err) {
        if (res.statusCode === 200) {
            const $ = cheerio.load(body);

            const news = $('.stories-set__item');
             const lastNews10 = news.slice(0, 10);
            lastNews10.each((i, item) => {
                const date = $(item).find('.story__date').text();
                const title = $(item).find('.story__title a').text();
                const href = $(item).find('.story__title a').attr('href');

                console.log('\n=================');
                console.log(`Заголовок: ${title}`);
                console.log(`Источник: ${date}`);
                console.log(`ссылка: https://yandex${href}`);
                console.log('=================\n');
            });

        }
    }
});