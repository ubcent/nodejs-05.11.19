const clc = require('cli-color');
const express = require('express');
const consolidate = require('consolidate');
const path = require('path');
const mongoose = require('mongoose');
const handlebars = require('handlebars');

/** порт нашего приложения */
const PORT = 3000;
/** url адресс нашего приложения */
const SERVER_URL = 'http://localhost';

mongoose.connect('mongodb://192.168.99.100:32768/tasks', { useNewUrlParser: true, useUnifiedTopology: true });

const Task = require('./models/Task');
const app = express();

app.engine( 'hbs', consolidate.handlebars );

app.use( express.json() );
app.use( express.urlencoded( { extended: false } ) );
app.use( express.static( `${ __dirname }/views` ) );

app.set( 'view engine', 'hbs' );
app.set( 'views', path.resolve( __dirname, 'views') );

/**
 * хелпер отрисовки чекбокса
 * @param task 
 **/
handlebars.registerHelper('checkBox', ({ _id, completed }) => {
    return new handlebars.SafeString( 
        `<input class="btn_check" type="checkbox" data-id="${ _id }" ${ completed ? 'checked' : '' }/>`
    );
});

/** Получаем список всех задач */
app.get('/tasks', async ( req, res ) => {
    const tasks = await Task.find();
    res.render( 'index', { tasks });
});

/** создание новой задачи  */
app.post('/tasks', async ( req, res ) => {
    const task = new Task(req.body);  
    await task.validate( async (errors) => {
        if ( !errors ) {
            await task.save();
        }
    });
    res.redirect( '/tasks' );
}); 

/** удаление задачи */
app.delete('/tasks', async ( req, res ) => {
    try {
        const { body: { id } } = req;
        await Task.findByIdAndDelete(id);
        res.send( true );
    } catch( e ) {
        res.send( false );
    }
});

/** Переключение статуса задачи */
app.put('/tasks', async ( req, res ) => {
    try {
        const { body: { id } } = req;
        const task = await Task.findById(id );
        task.completed = !task.completed;
        task.save();
        res.send( task.completed );
    } catch( e ) {
        res.send( false );
    }
});

/** Страница редактирования */
app.get('/tasks/update/:id', async ( req, res ) => {
    const { params: { id } } = req;
    const task = await Task.findById( id );
    res.render( 'update', { task });
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
        }
    });

    res.redirect( '/tasks');
});

app.listen( 3000, () => console.log(
    clc.yellow(`==================== Server start ====================\n`),
    clc.green(`\t${ SERVER_URL }:${ PORT }`)
));