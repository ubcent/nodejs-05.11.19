const express = require('express');
const connect = require('./mongoCfg.js.js');
const Task = require('./models/tasks');
const consolidate = require('consolidate');
const path = require('path');

const app = express();
app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/node_modules/jquery/dist'));

app.listen(3000, () => {
    console.log('Server has been started!');
});

app.get('/', async (req, res) => {
    const taskList = await Task.find({});
    res.render('main', { taskList });
});

app.post('/getTask', async (req, res) => {
    const getTask = await Task.find({ _id: req.body.editTaskButton });
    res.render('editTask', { getTask });
});

app.post('/addTask', async (req, res) => {
    const task = new Task({
        title: req.body.inputTask,
        priorityTask: req.body.gridRadios
    });
    const savedTask = await task.save();
    res.redirect('/');
});

app.post('/delTask', async (req, res) => {
    const task = await Task.deleteMany({ _id: { $in: req.body.checkBoxTask } });
    res.redirect('/');
});

app.get('/home', async (req, res) => {
    res.redirect('/');
});

app.post('/editTask', async (req, res) => {
    const task = await Task.updateMany({ _id: req.body.idTask }, { $set: { title: req.body.inputEditTask, priorityTask: req.body.gridRadios } });
    res.redirect('/');
})