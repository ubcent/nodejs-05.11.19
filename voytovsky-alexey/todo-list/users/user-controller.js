const User      = require('./user-model');
const passport  = require('../auth/auth-local');

module.exports = app => {
  // Registration
  app.get('/register', (req, res) => {
    res.render('../register/register-view');
    // @TODO: err-repass
  });

  app.post('/register', async (req, res) => {
    const { repassword, ...restBody } = req.body;

    if (restBody.password === repassword) {
      const user = new User(restBody);
      const savedUser = await user.save();
      req.logout();
      res.redirect('/auth');

    } else {
      res.redirect('/register?err=repass');
    }
  });

  // Authentication
  app.post('/auth', passport.authenticate);

  // Authentication redirect & error handling
  app.get('/auth', (req, res) => {
    if (req.user) res.redirect('/tasks');
    const { error } = req.query;
    res.render('../auth/auth-view', { error });
  });

  // Sign out
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/auth');
  });
};
