const { Schema, model } = require('mongoose');
const { genSaltSync, hashSync, compareSync } = require('bcryptjs');

const SALT_ROUNDS = 12;

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    secondName: { type: String },
});

userSchema.pre('save', function(next) {
    if ( this.isModified('password') ) {
        this.password = hashSync(this.password, genSaltSync( SALT_ROUNDS ) );
    }
    next();
});

userSchema.methods = {
    validatePassword: function( candidate ) { 
        return compareSync( candidate, this.password );
    },
};

module.exports = model('User', userSchema, 'users');