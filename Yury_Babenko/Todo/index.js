const express = require('express');
const consolidate = require('consolidate');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();

mongoose.connect('mongodb://192.168.99.100:32768/todoList', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Task = require('./models/task');
const User = require('./models/user');
const passport = require('./auth');

app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({
  extended: false,
}));
app.use(express.static(__dirname + '/public'));
app.use(session({
  resave: true,
  saveUninitialized: false,
  secret: 'secret phrase',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));
app.use(passport.initialize);
app.use(passport.session);

app.use(/\/((?!api|auth|registration).)*/, passport.mustBeAuthenticated);
app.use('/auth', passport.mustBeNotAuthenticated);
app.use('/registration', passport.mustBeNotAuthenticated);

app.get('/', async (req, res) => {
  const tasks = await Task.find({});

  res.render('todo', { tasks });
});

app.get('/registration', (req, res) => {
  res.render('registration');
});

app.get('/auth', (req, res) => {
  const { error } = req.query;
  res.render('auth', { error });
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/auth');
});

app.post('/api/auth', passport.authenticate);

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
  const updatedTask = await Task.updateOne(
    { _id: req.body.id },
    { $set: req.body.data,
    }
  );

  res.json(updatedTask);
})

app.post('/api/users', async (req, res) => {
  const { repassword, ...restBody } = req.body;

  if (restBody.password === repassword) {
    const user = new User(restBody);
    const errors = user.validateSync();
    
    if (errors) {
      res.send(errors);
    } else {
      await user.save();

      res.send({
        ...user,
        success: true,
    });
    }
  } else {
    res.send({
      success: false,
      errors: {
        passConfirmation: false,
      }
    });
  }
});

app.listen(3000, () => {
  console.log('Server has been started');
});
