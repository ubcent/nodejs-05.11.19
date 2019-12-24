const express = require('express');
const mongoose = require('mongoose');
const consolidate = require('consolidate');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const config = require('./config.json');
const jwt = require('jsonwebtoken');

// здесь подключаю конфиг с настройками подключения к mongodb
mongoose.connect(config.mogodbConfig, {useNewUrlParser: true, useUnifiedTopology: true});

const Task = require('./modeles/task.js');
const User = require('./modeles/user.js');
const passport = require('./auth.js');

const app = express();
app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
  resave: true,
  saveUninitialized: false,
  secret: 'secret of node',
  store: new MongoStore({mongooseConnection: mongoose.connection}),
}));
app.use(passport.initialize);
app.use(passport.session);
app.use('/tasks', passport.mustBeAuthenticated);
app.use(cors());
app.use(express.json());
// app.use(body_parser);

//главная страница
app.get('/', (req, res) => {
  res.status(200).render('main');
});
// список всех задач
app.get('/tasks', async (req, res) => {
  const {_id} = req.user;
  const tasks = await Task.find({user: _id});
  if (tasks) {
    res.status(200).render('tasks', {tasks});
  } else {
    res.status( 404 ).send();
  }
});
//отметить выполнение
app.put('/completed/:id/:completed', async (req, res) => {

  console.log(req.params.id);
  console.log(req.params.completed);
  // console.log(req.body);
  // let completed = true;
  // if (req.body.completed === 'Отметить как невыполненую') {
  //   completed = false;
  // }
  await Task.updateOne({_id: req.params.id}, {completed: req.params.completed});
  res.status(200).json('ok');
});
//редактирование
app.get('/tasks/:id', async (req, res) => {
  const tasks = await Task.find({_id: req.params.id});
  let data;
  tasks.forEach(el => data = el);
  res.render('task_edit', {data});
});
app.put('/tasks/:id', async (req, res) => {
  console.log(req.params.id);
  console.log(req.body);
  res.status(200).json('ok');
  // let completed = true;
  // if (req.body.completed === 'Невыполнена') {
  //   completed = false;
  // }
  // await Task.updateOne({_id: req.body._id}, {title: req.body.title, completed: completed});
  // res.redirect('/tasks');
});
//удаление
app.delete('/tasks/:id', async (req, res) => {
  console.log(req.params.id);
  await Task.findByIdAndRemove({_id: req.params.id});
  res.status(204).json('ok');
});
//добавление задач
app.get('/tasks/add', async (req, res) =>{
  res.render('add_task');
});
app.post('/tasks', async (req, res) => {
  const {_id} = req.user;
  data_completed = true;
  if (req.body.completed === 'Невыполнена') {
    data_completed = false;
  }
  const task = new Task({title: req.body.title, completed: data_completed, user: _id});
  task.save();
  res.status(204);
  res.redirect('/tasks');
});
//регистрация
app.get('/register', (req, res) => {
  res.render('register');
});
app.post('/register', async (req, res) => {
  const { repassword, ...restBody } = req.body;
  if (restBody.password === repassword) {
    const user = new User(restBody);
    await user.save();
    res.redirect('/auth');//с сессией

    // res.status(201);
  } else {
    res.redirect('/register?err=repass');//ссесия

    // res.status(400).json({err: 'ошибка регистрации'});
  }
});
// аунтефикация
app.get('/auth', (req, res)=> {
  const { error } = req.query;
  res.render('auth', {error});
});
app.post('/auth', passport.authenticate);

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/auth');
});
// какой порт слушаем
app.listen(3000, () => {
  console.log('Server has been started!');
});