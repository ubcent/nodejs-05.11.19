const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title:{type: String, required: true},
    completed: {type: Boolean, default: false},
    priorityTask: {type: String, required: true}
});

module.exports = mongoose.model('TaskBabkin', taskSchema, 'tasksbabkin');