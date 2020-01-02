const passport  = require('passport');
const Strategy  = require('passport-local').Strategy;
const User      = require('../users/user-model');

// e-mail & password authentication
passport.use(
  new Strategy({ usernameField: 'email' }, async (username, password, done) => {
    try {
      const user = await User.findOne({ email: username });

      if (!user || !user.validatePassword(password)) {
        return done(null, false);
      }

      const plainUser = JSON.parse(JSON.stringify(user));
      delete plainUser.password;

      done(null, plainUser);
    }
    catch(err) {
      throw new Error(err);
      // Render err
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);

    const plainUser = JSON.parse(JSON.stringify(user));
    delete plainUser.password;

    done(null, plainUser);
  }
  catch(err) {
    throw new Error(err);
    // Render err
  }
});

module.exports = {
  initialize: passport.initialize(),
  session: passport.session(),
  authenticate: passport.authenticate('local', {
    successRedirect:  '/tasks',
    failureRedirect: '/auth?error=1',
  }),
  mustBeAuthenticated: (req, res, next) => req.user ? next() : res.redirect('/auth'),
};
