const express = require('express');
const connect = require('./mongoCfg.js');
const Task = require('./models/tasks');
const consolidate = require('consolidate');
const path = require('path');
const cheerio = require('cheerio');
const bodyParser = require('body-parser');

const app = express();
let taskList;
app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/node_modules/jquery/dist'));
app.use(bodyParser.json());

app.listen(3000, () => {
    console.log('Server has been started!');
});

app.get('/', async (req, res) => {
    taskList = await Task.find({});
    res.render('main', { taskList });
});

app.post('/addTask', async (req, res) => {
    const task = new Task({
        title: req.body.inputTask,
        priorityTask: req.body.gridRadios
    });
    const savedTask = await task.save();
    taskList = await Task.find({});
    res.render('main', { taskList });
});

app.post('/delTask', async (req, res) => {
    const task = await Task.deleteMany({ _id: { $in: req.body.checkBoxTask } });
    taskList = await Task.find({});
    res.render('main', { taskList });
});