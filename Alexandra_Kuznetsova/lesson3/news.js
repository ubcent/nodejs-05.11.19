const request = require('request');
const cheerio = require('cheerio');
const color = require('colors');

request('https://hi-tech.news/', (err, res, body) => {
  if ( !err && res.statusCode === 200 ) {
    const $ = cheerio.load(body);
    $('#dle-content').each(function(i, element){
      for ( i = 1; i <= 10; i++ ) {
        let title = $(this).find(`#dle-content > div:nth-child(${i}) > div > div.post-content > h2`).eq(0).text();
        let text = $(this).find(`#dle-content > div:nth-child(${i}) > div > div.post-content > div.the-excerpt`).eq(0).text();
        console.log( 
          title.brightMagenta.underline + '\n'
          + text.brightWhite + '\n'
        );
      }
    });
  }
});
