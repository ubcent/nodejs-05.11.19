const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const Schema = mongoose.Schema;

const SALT_ROUND = 12;

const userSchema = new Schema({
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
});

userSchema.pre('save', (next) => {
    if (this.isModified('password')) {
        const salt = bcryptjs.genSaltSync(SALT_ROUND);
        this.password = bcryptjs.hashSync(this.password, salt);
    }
    next();
});

userSchema.methods.validatePassword = (candidate) => {
    return bcryptjs.compareSync(candidate, this.password)
}

module.exports = mongoose.model('User', userSchema, 'users');