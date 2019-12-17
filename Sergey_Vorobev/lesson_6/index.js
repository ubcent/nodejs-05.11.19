const express = require('express');
const consolidate = require('consolidate');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


mongoose.connect('mongodb://localhost:27017/tasks', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Task = require('./models/task');
const User = require('./models/user');
const passport = require('./models/signin');

const app = express();

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.static('public'));
app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: 'super private key',
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    }),
}));
app.use(passport.initialize);
app.use(passport.session);

app.use('/tasks', passport.mustBeAuthenticated);

app.get('/', (req,res) => {
  const {signup} = req.query;
  res.render('index', {signup});
})

app.get('/tasks', async (req, res) => {
 const {saved} = req.query;

    const { _id } = req.user;
    const tasks = await Task.find({ user: _id });
    res.render('tasks', {
        tasks, 
        saved,
    });

});

app.get('/newTask', (req, res) => {

    res.render('newTask');
});

app.get('/del', async (req, res) => {
    const idTask = req.query.id;
    await Task.deleteOne({
        '_id': idTask
    });
    res.redirect('/tasks');
});

app.get('/edit', async (req, res) => {
    const idTask = req.query.id;
    const task = await Task.find({
        '_id': idTask
    });
    res.render('edit', {
        task
    })
});

app.get('/signup', (req, res) => {
  const { err } = req.query;
    res.render('signup', {err});
});

app.get('/signin', (req, res) => {
  const { error } = req.query;
  res.render('signin', {error});
});

app.get('/logout', (req, res) => {
  req.logout();

  res.redirect('/');
});

app.post('/signin', passport.authenticate,);

app.post('/completed', async (req, res) => {
    const {
        id,
        completed
    } = req.body;
    await Task.updateOne({
        '_id': id
    }, {
        'completed': completed
    });
    res.redirect('/tasks');
});

app.post('/edit', async (req, res) => {
    await Task.updateOne({
        '_id': req.body.id
    }, {
        'title': req.body.title,
        'description': req.body.description
    }, {
        upsert: true
    }, (err) => {
        if (err) {
            throw err;
        }
    });
    res.redirect('/tasks');
});

app.post('/tasks', async (req, res) => {
    const { _id } = req.user;

    const task = new Task({...req.body, user: _id});
    await task.save();

    res.redirect('/tasks?saved=1');
});

app.post('/signup', async (req, res) => {
    const { repassword, ...userBody} = req.body;
if (userBody.password === repassword) {
    const user = new User(userBody);
   await user.save();

   res.redirect('/?signup=1');
} else {
    res.redirect('/signup?err=1');
}

});

app.listen(3000, () => {
    console.log('Сервер запущен на 3000 порту');
});