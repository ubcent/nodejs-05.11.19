const mongoose = require('mongoose');

const MONGO_HOST = 'localhost';
const MONGO_PORT = '32768';
const MONGO_DB = 'TaskBabkin';

const url = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {
    console.log('MongoDB has been started!')
})
.catch(() => {
    console.log('MongoDB is not start!')
});

