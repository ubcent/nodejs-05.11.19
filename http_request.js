const http = require('http');
const https = require('https');

https.get('https://geekbrains.ru', (res) => {
  console.log('response', res.statusCode);

  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(chunk);
  });
}).on('error', (err) => {
  console.log('Error', err);
});