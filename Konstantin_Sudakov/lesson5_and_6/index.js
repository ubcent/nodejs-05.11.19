const express = require('express');
const mongoose = require('mongoose');
const consolidate = require('consolidate');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const config = require('./config.json');

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
app.use('/task', passport.mustBeAuthenticated);

//главная страница
app.get('/', (req, res) => {
  res.render('main');
});
// список всех задач
app.get('/tasks', async (req, res) => {
  const {_id} = req.user;
  const tasks = await Task.find({user: _id});
  res.render('tasks', {tasks});
});
//отметить выполнение
app.post('/tasks/completed', async (req, res) => {
  let completed = true;
  if (req.body.completed === 'Отметить как невыполненую') {
    completed = false;
  }
  await Task.updateOne({_id: req.body._id}, {completed: completed});
  res.redirect('/tasks');
});
//редактирование
app.get('/tasks/edit/:id', async (req, res) => {
  const tasks = await Task.find({_id: req.params.id});
  let data;
  tasks.forEach(el => data = el);
  res.render('task_edit', {data});
});
app.post('/tasks/edit', async (req, res) => {
  let completed = true;
  if (req.body.completed === 'Невыполнена') {
    completed = false;
  }
  await Task.updateOne({_id: req.body._id}, {title: req.body.title, completed: completed});
  res.redirect('/tasks');
});
//удаление
app.post('/tasks/delete', async (req, res) => {
  console.log(req.body);
  await Task.findByIdAndRemove({_id: req.body._id});
  res.redirect('/tasks');
});
//добавление задач
app.get('/task/add', async (req, res) =>{
  res.render('add_task');
});
app.post('/task/add', async (req, res) => {
  const {_id} = req.user;
  data_completed = true;
  if (req.body.completed === 'Невыполнена') {
    data_completed = false;
  }
  const task = new Task({title: req.body.title, completed: data_completed, user: _id});
  task.save();
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
    res.redirect('/auth');
  } else {
    res.redirect('/register?err=repass');
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