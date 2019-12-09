const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// схема для создания заметок
const taskSchema = new Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  body: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema, 'tasks');