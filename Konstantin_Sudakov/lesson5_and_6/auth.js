const passport = require('passport');
const Strategy = require('passport-local').Strategy;

const User = require('./modeles/user.js');
passport.use(
  new Strategy({usernameField: 'email'}, async (username, password, done) => {
    const user = await User.findOne({email: username});

    if (!user || !user.validatePassword(password)) {
      return done(null, false);
    }
    const plain = JSON.parse(JSON.stringify(user));
    delete plain.password;
    done(null, plain); // req.user можно взять
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  const plain = JSON.parse(JSON.stringify(user));
  delete plain.password;
  done(null, plain); // req.user можно взять
});

module.exports = {
  initialize: passport.initialize(),
  session: passport.session(),
  authenticate: passport.authenticate('local', {
    successRedirect: '/tasks',
    failureRedirect: '/auth?error=1',
  }),
  mustBeAuthenticated: (req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect('/auth');
    }
  }
};