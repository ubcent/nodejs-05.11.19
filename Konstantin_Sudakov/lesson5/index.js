const express = require('express');
const mongoose = require('mongoose');
const consolidate = require('consolidate');
const path = require('path');


mongoose.connect('mongodb://localhost:27017/test', {useNewUrlParser: true, useUnifiedTopology: true});

const Task = require('./modules/task.js');

const app = express();
app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


//главная страница
app.get('/', (req, res) => {
  res.render('main');
});
// список всех задач
app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  tasks_arr = [];
  tasks.forEach(el => tasks_arr.push(el));
  res.render('tasks', {tasks_arr});

});

app.post('/tasks', async (req, res) => {

  if (req.body.edit) {
    //редактирование
    const tasks = await Task.find({_id: req.body._id});
    let data;
    tasks.forEach(el => data = el);
    res.render('edit_task', {data});// переходим в форму редактирования прокидывая объект задачи
  } else {
    //удаление
    if (req.body.delete) {
      const tasks = new Task({_id: req.body._id});
      tasks.remove();
    }
    if (req.body.completed) {
      //поменять completed
      let completed = true;
      if (req.body.completed === 'Отметить как невыполненую') {
        completed = false;
      }
      const tasks = await Task.update({_id: req.body._id}, {_id: req.body._id, completed: completed});
    }
    const tasks = await Task.find();
    tasks_arr = [];
    tasks.forEach(el => tasks_arr.push(el));
    res.render('tasks', {tasks_arr});
  }
});
 //редактирование
app.post('/edit_task', async (req, res) => {
  console.log(req.body);
  let completed = true;
  if (req.body.completed === 'Невыполнена') {
    completed = false;
  }
  const tasks = await Task.update({_id: req.body._id}, {_id: req.body._id, title: req.body.title, completed: completed});
  console.log(tasks);
  res.render('add_ok');
});

//добавление задач
app.get('/add_task', async (req, res) =>{
  res.render('add_task');
});
app.post('/add_task', async (req, res) => {
  console.log(req.body);
  data_completed = true;
  if (req.body.completed === 'Невыполнена') {
    data_completed = false;
  }
  const task = new Task({title: req.body.title, completed: data_completed});
  task.save();
  res.render('add_ok')
});

app.listen(3000, () => {
  console.log('Server has been started!');
});