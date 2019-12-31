// подключаем необходимые модули
const mongoose    = require('mongoose');
const db          = require('./config/db');
const express     = require('express');
const consolidate = require('consolidate');
const path        = require('path');
const config      = require('./config/config.json');
const app         = express();
const auth        = require('./auth');
const port        = 3000;
const cors        = require('cors');
const jwt         = require('jsonwebtoken');
const http        = require('http');
const socketIO    = require('socket.io');

app.use(express.json());
app.use(cors());

const server = http.Server(app);
const io = socketIO(server);

// подключаемся к базе данных и устанавливаем прослушивание на порт 3000
mongoose.connect(db.URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err) => {
  if( err ) return console.log(err)
  require('./app/routes')(app, io);
  server.listen(port, () => {
    console.log('Server has been started on ' + port);
  });               
});

app.get('/', (req, res) => {
  res.sendFile(
    path.resolve(__dirname, 'views', 'index.html'),
  );
});

app.get('/auth', (req, res) => {
  res.sendFile(
    path.resolve(__dirname, 'views', 'auth.html'),
  );
});

app.get('/register', (req, res) => {
  res.sendFile(
    path.resolve(__dirname, 'views', 'register.html'),
  );
});

// доступно только после аутентификации
app.use('/tasks', auth.checkAuthentication);
