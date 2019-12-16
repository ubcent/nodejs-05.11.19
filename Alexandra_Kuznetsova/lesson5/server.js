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
const session     = require('express-session');
const MongoStore  = require('connect-mongo')(session);
const jsonParser  = express.json();
const passport = require('./auth');
const port        = 8000;

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(session({
  resave: true,
  saveUninitialized: false,
  secret: 'ppp123890456nodeauth7',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));
app.use(passport.initialize);
app.use(passport.session);

// подключаемся к базе данных и устанавливаем прослушивание на порт 8000
mongoose.connect(db.URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err, database) => {
  if( err ) return console.log(err)
  require('./app/routes')(app, database);
  app.listen(port, () => {
    console.log('Server has been started on ' + port);
  });               
});

// доступно только после аутентификации
app.use('/tasks', passport.mustBeAuthenticated);
app.use('/user', passport.mustBeAuthenticated);

app.get('/register', (req, res) => {
  res.render('register');
});
