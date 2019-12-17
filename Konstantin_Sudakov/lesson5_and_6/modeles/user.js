const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;
const SALT_ROUND = 12;

const userSchema = new Schema({
  email: {type: String, required: true},
  firstName: {type: String},
  lastName: {type: String},
  password: {type: String},
});

userSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    const salt = bcrypt.genSaltSync(SALT_ROUND);
    this.password = bcrypt.hashSync(this.password, salt);
  }

  next();
});

userSchema.methods.validatePassword = function(canditate) {
  return bcrypt.compareSync(canditate, this.password);
};

module.exports = mongoose.model('User', userSchema, 'users');