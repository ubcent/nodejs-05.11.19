const express = require('express');
const connect = require('./mongoCfg');
const Task = require('./models/task');
const User = require('./models/user');
const consolidate = require('consolidate');
const path = require('path');
const session = require('express-session');
// const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');
const passport = require('./auth')
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.engine('hbs', consolidate.handlebars);
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/node_modules/jquery/dist'));
// app.use(session({
//     resave: true,
//     saveUninitialized: false,
//     secret: 'super secret phrase',
//     store: new MongoStore({mongooseConnection: mongoose.connection}),
// }));
app.use(passport.initialize);
app.use(passport.session);
// app.use('/task', passport.mustBeAuthenticated);
app.use(cors());
app.use('/task', checkAuthantication);

app.listen(3000, () => {
    console.log('Server has been started!');
});

//маршрутизация

// редиректы

app.get('/', async (req, res) => {
    res.redirect('/home')
});

app.get('/home', async (req, res) => {
    res.render('register');
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/home');
});



//регистрация

app.post('/register', async (req, res) => {
    console.log(req.body);
    const { repassword, ...restBody } = req.body;

    if (restBody.password === repassword) {
        const user = new User(restBody);
        await user.save();
        res.status(201).send({ message: 'Пользователь успешно создан!' });
    } else {
        res.status(400).json({ message: 'Ошибка в создании пользователя' });
    }
});

// авторизация

app.post('/auth', async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({email:username});
    if(!user) {
        return res.status(401);
    };

    if(!user.ValidatePassword(password)) {
        return res.status(401);
    }

    const plainUser = JSON.parse(JSON.stringify(user));
    delete plainUser.password;

    res.status(200).json({
        ...plainUser,
        token: jwt.sign(plainUser, 'super secret key'),
    });
});

app.get('/auth', (req, res) => {
    const { error } = req.query;
    res.render('auth', { error });
});

const checkAuthantication = (req, res, next) => {
    if (req.headers.authorization) {
        const [type, token] = req.headers.authorization.split(' ');
        jwt.verify(token, 'super secret key', (err, decoded) => {
            if (err) {
                return res.status(403).send();
            }
            req.user.decoded;
            next();
        });
    } else {
        res.status(403).send();
    }
}

// получение списка задач

app.get('/tasks', async (req, res) => {
    const taskList = await Task.find({});
    res.status(200).json(taskList);
    res.render('main', { taskList });
});

app.get('/tasks:id', async (req, res) => {
    const taskListUser = await Task.findById(req.params.id);
    res.status(200).json(taskListUser);
    res.render('main', { taskListUser });
});

// добавление задачи

app.post('/addTask', (req, res) => {
    const task = new Task({
        title: req.body.inputTask,
        priorityTask: req.body.gridRadios
    });
    task.save()
        .then((savedTask) => {
            res.status(204).json(savedTask);
        })
        .catch(() => {
            res.status(400).json({ message: 'Validation error' })
        });
});

// изменение задачи

app.post('/getTask', async (req, res) => {
    const getTask = await Task.find({ _id: req.body.editTaskButton });
    res.render('editTask', { getTask });
});

app.put('tasks/:id', async (req, res) => {
    const task = await Task.findOneAndUpdate({ _id: req.params.id }, { $set: req.body });
    res.status(200).json(task);
})

// app.post('/editTask', async (req, res) => {
//     await Task.updateMany({ _id: req.body.idTask }, { $set: { title: req.body.inputEditTask, priorityTask: req.body.gridRadios } });
//     res.redirect('/task');
// })

// удаление задачи

// app.post('/delTask', async (req, res) => {
//     await Task.deleteMany({ _id: { $in: req.body.checkBoxTask } });
//     res.redirect('/task');
// });

app.delete('tasks/:id', async(req, res) => {
    await Task.findOneAndRemove({_id: req.params.id});
    res.status(204).json.send()
})













