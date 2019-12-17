const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const Schema = mongoose.Schema;

const SALT_ROUNDS = 12;

const userSchema = new Schema({
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
});

userSchema.pre('save', function(next) {
    if(this.isModified('password')) {
        const salt = bcryptjs.genSaltSync(SALT_ROUNDS);
        this.password = bcryptjs.hashSync(this.password, salt)
    }
    next();
});

userSchema.methods.validatePassword = function(candidate) {
    return bcryptjs.compareSync(candidate, this.password);
}

module.exports = mongoose.model('User', userSchema, 'users');