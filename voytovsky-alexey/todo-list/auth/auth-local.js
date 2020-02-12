const passport  = require('passport');
const Strategy  = require('passport-local').Strategy;
const User      = require('../users/user-model');

// e-mail & password authentication
passport.use(
  // Done is a callback function to determine whether user has been successfully authorized
  new Strategy({ usernameField: 'email' }, async (username, password, done) => {
    try {
      const user = await User.findOne({ email: username });

      if (!user || !user.validatePassword(password)) {
        return done(null, false);  // null is reserved for error handling
      }
    
      // Converting Mongo object to plain JS object (need a clean object: only fields, no methods)
      const plainUser = JSON.parse(JSON.stringify(user));
      // Now it's possible to delete password
      delete plainUser.password;
      done(null, plainUser);  // req.user
    }
    catch(err) {
      throw new Error(err);
      // Render err
    }
  })
);

// User is plainUser from above here
passport.serializeUser((user, done) => {
  // Saving user ID to the session to recognize him (the user) in future
  done(null, user._id);
});

// This is used when the user comes in future.
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);

    const plainUser = JSON.parse(JSON.stringify(user));
    delete plainUser.password;
    done(null, plainUser);  // req.user
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
