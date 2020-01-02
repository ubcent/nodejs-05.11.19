const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    deadline: { type: Date },
    user: { type: Schema.ObjectId, ref: 'User' }
  }, {
    versionKey: false,
  }
);

module.exports = mongoose.model('Task', taskSchema, 'tasks');
