// подключаем необходимые модули
const mongoose    = require('mongoose');
const db          = require('./config/db');
const express     = require('express');
const consolidate = require('consolidate');
const path        = require('path');
const request     = require('request');
const cheerio     = require('cheerio');
const config      = require('./config/config.json');
const app         = express();
const jsonParser  = express.json();
const port        = 8000;

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// подключаемся к базе данных и устанавливаем прослушивание на порт 8000
mongoose.connect(db.URL, { useNewUrlParser: true, useUnifiedTopology: true }, (err, database) => {
  if( err ) return console.log(err)
  require('./app/routes')(app, database);
  app.listen(port, () => {
    console.log('Server has been started on ' + port);
  });               
});

// рендерим страницу формы
app.get('/', (req, res) => {
  res.render('notes');
});