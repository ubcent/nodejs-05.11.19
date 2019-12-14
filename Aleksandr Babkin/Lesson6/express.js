const express = require('express');
const connect = require('./mongoCfg');
const Task = require('./models/tasks');
const User = require('./models/user');
const consolidate = require('consolidate');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const passport = require('./auth')

const app = express();
app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/node_modules/jquery/dist'));
app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: 'super secret phrase',
    store: new MongoStore({mongooseConnection: mongoose.connection}),
}));
app.use(passport.initialize);
app.use(passport.session);
app.use('/task', passport.mustBeAuthenticated);

app.listen(3000, () => {
    console.log('Server has been started!');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get ('/logout', (req, res) => {
    req.logout();
    res.redirect('/auth');
});

app.get('/auth', (req, res) => {
    const {error} = req.query;
    res.render('auth', {error});
});

app.post('/register', async (req, res) => {
    console.log(req.body);
    const { repassword, ...restBody } = req.body;

    if (restBody.password === repassword) {
        const user = new User(restBody);
        await user.save();
        res.redirect('/auth');
    } else {
        res.redirect('/register?err=repass');
    }
});

app.post('/auth', passport.authenticate);

app.get('/task', async (req, res) => {
    const taskList = await Task.find({});
    res.render('main', { taskList });
});

app.get('/', async (req, res) => {
    res.redirect('/task')
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
    await task.save();
    res.redirect('/');
});

app.post('/delTask', async (req, res) => {
    await Task.deleteMany({ _id: { $in: req.body.checkBoxTask } });
    res.redirect('/');
});

app.get('/home', async (req, res) => {
    res.redirect('/');
});

app.post('/editTask', async (req, res) => {
    await Task.updateMany({ _id: req.body.idTask }, { $set: { title: req.body.inputEditTask, priorityTask: req.body.gridRadios } });
    res.redirect('/');
})