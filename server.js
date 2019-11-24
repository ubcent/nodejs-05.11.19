const http = require('http');
const utils = require('url');

http.createServer((req, res) => {
  const query = utils.parse(req.url, true);
  console.log(query);
  res.writeHead(200, {
    'Content-type': 'application/json',
  });
  res.write(JSON.stringify({ message: 'It\'s alive!!!' }));
  res.end();
}).listen(3000);