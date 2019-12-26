const { cyanBright } = require('cli-color');
const express = require('express');
const consolidate = require('consolidate');
const path = require('path');
const mongoose = require('mongoose');
// const appearance = require('./scripts/appearance.js');

mongoose.connect('mongodb://localhost:32773/tasks', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, });
const Task = require('./models/task');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find({});

  res.render('tasks', { tasks, title: 'ToDo List'});
});

app.post('/tasks/complete', async (req, res) => {
  const { id } = req.body;

  await Task.updateOne({_id: id}, { $set: { completed: true }});

  res.redirect('/tasks');  
});

app.post('/tasks/remove', async (req, res) => {
  const { id } = req.body;

  await Task.findByIdAndRemove(id);

  res.redirect('/tasks');
});

app.post('/tasks', async (req, res) => {
  const task = new Task(req.body);

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

app.listen(3005, () => {
  console.log(cyanBright('We are up and running, captain.\n:3005'));
});
