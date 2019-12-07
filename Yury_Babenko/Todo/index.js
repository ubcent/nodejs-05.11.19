const express = require('express');
const consolidate = require('consolidate');
const path = require('path');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://192.168.99.100:32769/todoList', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Task = require('./models/task');

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({
  extended: false,
}));
app.use(express.static(__dirname + '/public'));

app.get('/', async (req, res) => {
  const tasks = await Task.find({});

  res.render('todo', { tasks });
});

app.post('/api/task', async (req, res) => {
  const task = new Task(req.body)
  const savedTask = await task.save();

  res.json(savedTask);
})

app.delete('/api/task', async (req, res) => {
  const deletedTask = await Task.deleteOne({ _id: req.body.id });

  res.json(deletedTask);
})

app.patch('/api/task', async (req, res) => {
  const deletedTask = await Task.updateOne(
    { _id: req.body.id },
    { $set: {
        completed: req.body.data.completed,
      },
    }
  );

  res.json(deletedTask);
})

app.listen(3000, () => {
  console.log('Server has been started');
});
