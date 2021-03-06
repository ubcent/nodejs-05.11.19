const express = require('express');
const consolidate = require('consolidate');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

mongoose.connect('mongodb://localhost:32772/tasks', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const Task = require('./models/task');
const User = require('./models/user');
const passport = require('./auth');

const app = express();

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(session({
  resave: true,
  saveUninitialized: false,
  secret: 'super secret phrase',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));
app.use(passport.initialize);
app.use(passport.session);

app.use('/tasks', passport.mustBeAuthenticated);

app.get('/tasks', async (req, res) => {
  const { _id } = req.user;
  const tasks = await Task.find({ user: _id });

  res.render('tasks', {tasks});
});

app.post('/tasks/complete', async (req, res) => {
  const { id } = req.body;

  await Task.updateOne({_id: id}, { $set: { completed: true } });

  res.redirect('/tasks');
});

app.post('/tasks/remove', async (req, res) => {
  const { id } = req.body;

  await Task.findByIdAndRemove(id);

  res.redirect('/tasks');
});

app.post('/tasks', async (req, res) => {
  const { _id } = req.user;

  const task = new Task({ ...req.body, user: _id });
  await task.save();

  res.redirect('/tasks');
});

app.get('/tasks/:id', async (req, res) => {
  const task = await Task.findById(req.params.id);

  res.render('task', task);
});

app.post('/tasks/update', async (req, res) => {
  const { id, title } = req.body;

  await Task.updateOne({_id: id}, { $set: { title } });

  res.redirect('/tasks');
});

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

app.get('/auth', (req, res) => {
  const { error } = req.query;
  res.render('auth', {error});
});

app.post('/auth', passport.authenticate);

app.get('/logout', (req, res) => {
  req.logout();

  res.redirect('/auth');
});

app.listen(3000, () => {
  console.log('Server has been started!');
});