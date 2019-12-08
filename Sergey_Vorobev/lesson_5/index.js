const express = require('express');
const consolidate = require('consolidate');
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/tasks', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Task = require('./models/task');

const app = express();

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true}));


app.get('/', async (req, res) =>{
    const tasks = await Task.find();
    res.render('index', {
        tasks
    });

});

app.get('newTask', (req, res) => {
    res.render('newTask');
});

app.post('/', async (req, res) => {
    const task = new Task(req.body);
    const saveTask = await task.save();
    const tasks = await Task.find();

    res.render('index', {
        saved: 'задача успешно добавлена!',
        tasks
    });
});

app.listen(3000, () => {
    console.log('Сервер запущен на 3000 порту');
});