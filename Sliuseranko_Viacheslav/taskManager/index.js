const clc = require('cli-color');
const express = require('express');
const consolidate = require('consolidate');
const path = require('path');
const mongoose = require('mongoose');
const handlebars = require('handlebars');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const http = require('http');
const socketIO = require('socket.io');

/** порт нашего приложения */
const PORT = 3000;
/** url адресс нашего приложения */
const SERVER_URL = 'http://localhost';

mongoose.connect('mongodb://192.168.99.100:32768/tasks', { useNewUrlParser: true, useUnifiedTopology: true });
const passport = require('./auth');

const Task = require('./models/Task');
const User = require('./models/User');

const app = express();

const server = http.Server( app );
const io = socketIO( server );
  
app.engine( 'hbs', consolidate.handlebars );
app.use( cors() );
app.use( express.json() );
app.use( express.urlencoded( { extended: false } ) );
app.use( express.static( `${ __dirname }/views` ) );

app.set( 'view engine', 'hbs' );
app.set( 'views', path.resolve( __dirname, 'views') );
app.use( '/tasks', passport.checkAuthentication );

app.use( passport.initialize );

io.use(( socket, next ) => {
    const token = socket.handshake.query.token;

    jwt.verify( token, 'secret key', ( err ) => {
        if ( err ) {
            return next( new Error('authentication error') );
        }

        next();
    });

    return next( new Error('authentication error') );
});
  
io.on('connection', (socket) => {
    console.log('Someone has connected!');

    socket.on('create', async (data) => {
        const { title, userId } = data;

        const task = new Task({ title });
        const savedTask = await task.save();

        socket.broadcast.emit(`created:${ userId }`, savedTask );
        socket.emit(`created:${ userId }`, savedTask );
    });

    socket.on('toggle', async ( taskId ) => {
        const task = await Task.findById(taskId);
        task.set({ completed: !task.completed });
        task.save();
        socket.broadcast.emit(`toggle`, taskId );
    });

    socket.on('delete', async (taskId) => {
        await Task.findByIdAndDelete(taskId);
        socket.broadcast.emit('deleted', taskId );
        socket.emit( 'deleted', taskId );
    });

    socket.on('disconnect', () => {
        console.log('Someone has disconnected!');
    });
});

/**
 * хелпер отрисовки чекбокса
 * @param task 
 **/
handlebars.registerHelper('checkBox', ({ _id, completed }) => {
    return new handlebars.SafeString( 
        `<input class="btn_check" type="checkbox" data-id="${ _id }" ${ completed ? 'checked' : '' }/>`
    );
});

/** пути для навигационной панели у гостя */
const guetsPaths = [
    { title: 'login', url: '/login' },
    { title: 'register', url: '/register' },
];

/** пути для навигационной панели у пользователя */
const userPaths = [
    { title: 'tasks', url: '/tasks' },
    { title: 'logout', url: '/logout' },
];

/**
 * хелпер отрисовки навигационной панели
 * @param task 
 **/
handlebars.registerHelper('navpanel', ( user ) => {
    const currentNavRoutes = ( user ? userPaths : guetsPaths );
    const links = currentNavRoutes.map( ({ url, title }) => `<a href="${ url }">${ title }</a>&nbsp;`);
    return new handlebars.SafeString( links.join('') );
});

/** Получаем список всех задач */
app.get('/tasks', async ( req, res ) => {
    const tasks = await Task.find();
    res.status( 200 ).render( 'index', { tasks });
});

/** создание новой задачи  */
app.post('/tasks', async ( req, res ) => {
    const { user } = req.body;
    const plainUser = JSON.parse( user );

    const task = new Task({ ...req.body, user: plainUser._id });  
    await task.validate( async (errors) => {
        if ( !errors ) {
            await task.save();
            res.status( 200 ).send();
        } else {
            res.status( 400 ).send();
        }
    });
    res.redirect( '/tasks' );
}); 

/** удаление задачи */
app.delete('/tasks', async ( req, res ) => {
    try {
        const { body: { id } } = req;
        await Task.findByIdAndDelete(id);
        res.status( 203 ).send();
    } catch( e ) {
        res.status( 403 ).send();
    }
});

/** Переключение статуса задачи */
app.patch('/tasks/:id', async ( req, res ) => {
    const { params: { id } } = req;
    try {
        const task = await Task.findById( id );
        // const modifiedTask = await Task.findOneAndUpdate({ _id: req.params.id }, { $set: { ...task, ...req.body } });
        task.set({ completed: !task.completed });
        task.save();
        res.status( 200 ).send( task.completed );
    } catch( e ) {
        res.status( 304 ).send();
    }
});

/** Страница редактирования */
app.get('/tasks/update/:id', async ( req, res ) => {
    const { params: { id } } = req;
    const task = await Task.findById( id );
    res.status( 200 ).render( 'update', { task, user: req.user });
});

/** сохранение изменений */
app.post('/tasks/update/:id', async ( req, res ) => {
    const { params: { id } } = req;
    const { body: { title, completed } } = req;
    const task = await Task.findById( id );

    task.set( 'completed', completed );
    task.set( 'title', title );

    await task.validate( async (errors) => {
        if ( !errors ) {
            await task.save();
            res.status( 200 ).send();
        } else {
            res.status( 304 ).send();
        }
    });

    res.redirect( '/tasks');
});

app.get('/login', (req, res) => {
    const { query: { error } } = req;
    res.status( 200 ).render( 'auth/login', { error, user: req.user } );
});

app.post( '/login', async ( req, res ) => {
    const { username, password } = req.body;
    const user = await User.findOne({ email: username });
    
    if (!user) {
        return res.status(401).send();
    }
    
    if (!user.validatePassword(password)) {
        return res.status(401).send();
    }
    
    const plainUser = JSON.parse(JSON.stringify(user));
    delete plainUser.password;
    
    res.status(200).json({
        user: plainUser,
        token: jwt.sign( plainUser, 'secret key' ),
    });
});

app.get('/logout', (req, res) => {
    req.logout();
    res.status( 302 ).redirect('/login');
});

/** подключаем страницу регистрации */
app.get('/register', ( req, res ) => {
    res.status( 200 ).render('auth/register', { user: req.user });
});

/** подключаем страницу регистрации */
app.post('/register', async ( req, res ) => {
    const { body: { repassword, ...userProps } } = req;
    const user = new User( userProps );
    const errors = user.validateSync();

    if ( repassword !== userProps.password ) {
        errors.push( { password: 'not mutch' } );
    } 

    if ( !errors ) {
       await user.save();
       res.status( 201 )
       return res.redirect('/login');
    } else {
        res.status( 400 )
    }

    res.redirect( '/register' );
});

server.listen( 3000, () => console.log(
    clc.yellow(`==================== Server start ====================\n`),
    clc.green(`\t${ SERVER_URL }:${ PORT }`)
));