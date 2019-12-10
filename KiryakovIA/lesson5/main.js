const express = require('express');
const consolidate = require('consolidate');
const path = require('path');
const mongoose = require('mongoose');

const { connectionString } = require('./config');
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const Task = require('./models/task');

const app = express();

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.urlencoded({extended: false}));

app.get('/tasks', async (req, res) => {
    const tasks = await Task.find({});
    res.render('tasks', { tasks });
});

app.post('/tasks', async (req, res) => {
    if (req.body.title){
        const task = new Task(req.body);
        await task.save();
    }
    res.redirect('/tasks');
});

app.post('/tasks/delete', async (req, res) => {
    const {_id} = req.body;
    await Task.findByIdAndRemove(_id);
    res.redirect('/tasks');
});

app.post('/tasks/complete', async (req, res) => {
    const {_id} = req.body;
    await Task.findByIdAndUpdate(_id, {completed: true});
    res.redirect('/tasks');
});

app.listen(3000, () => {
    console.log('Server has been started!');
});