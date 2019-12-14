const passport = require('passport');
const Strategy = require('passport-local').Strategy;
const User = require('./models/user');

passport.use(
    new Strategy({ usernameField: 'emailRegister' }, async (username, password, done) => {
        const user = await User.findOne({ emailRegister: username });
        if (!username) {
            return done(null, false);
        }

        if (!user.validatePassword(password)) {
            return done(null, false);
        }

        const plainUser = JSON.parse(JSON.stringify(user));
        delete plainUser.password;
        done(nul, plainUser);
    }),
);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    const plainUser = JSON.parse(JSON.stringify(user));
    delete plainUser.password;
    done(null, plainUser);
});

module.exports = {
    initialize: passport.initialize(),
    session: passport.session(),
    authenticate: passport.authenticate('local', {
        successRedirect: '/main',
        failureRedirect: '/auth?error=1'
    }),

    mustBeAuthenticated: (req, res, next) => {
        if (req.user) {
            next();
        } else {
            res.redirect('/auth');
        }
    }
}