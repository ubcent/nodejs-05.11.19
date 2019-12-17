const express = require('express');
const consolidate = require('consolidate');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const { connectionString } = require('./config');
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const Task = require('./models/task');
const User = require('./models/user');
const passport = require('./auth');

const app = express();

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.urlencoded({extended: false}));
app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: 'super secret',
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  }));
app.use(passport.initialize);
app.use(passport.session);
app.use('/tasks', passport.mustBeAuthenticated);

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

app.get('/register', (req, res) => {
    res.render('register');
  });
  
app.post('/register', async (req, res) => {
    const { repassword, ...restBody } = req.body;
    const { email } = req.body;
    if (!email) {
        res.render('register', { error: 'Необходимо задать Email.'});
        return;
    }
    let user = await User.findOne({ email });
    if (user){

        res.render('register', { error: 'Такой Email уже существует.'});
    } else if (restBody.password !== repassword) {
        res.render('register', { error: 'Пароли не совпадают.'});
    } else {
        user = new User(restBody);
        await user.save();
        res.redirect('/auth');
    }
});
  
app.get('/auth', (req, res) => {
    const { error } = req.query;
    res.render('auth', { error });
});
  
app.post('/auth', passport.authenticate);
  
app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/auth');
});

app.listen(3000, () => {
    console.log('Server has been started!');
});