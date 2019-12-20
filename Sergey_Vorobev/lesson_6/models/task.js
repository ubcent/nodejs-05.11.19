const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String},
    completed: {type: Boolean, default: false},
    user: { type: Schema.ObjectId, ref: 'User' },
});


module.exports = mongoose.model('Task', taskSchema, 'tasks');