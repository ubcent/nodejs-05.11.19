const express = require('express');
const consolidate = require('consolidate');
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:32772/tasks', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const Task = require('./models/task');

const app = express();

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.urlencoded({ extended: false }));

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();

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

app.listen(3000, () => {
  console.log('Server has been started!');
});