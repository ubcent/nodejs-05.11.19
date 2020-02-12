const User        = require('./user-model');
const passport    = require('../auth/auth-local');
const { schema }  = require('../validation');
const path        = require('path');

module.exports = app => {
  // Registration
  app.get('/register', (req, res) => {
    res.render('../register/register-view');
    // @TODO: err-repass
  });

  app.post('/register', async (req, res) => {
    const { repassword, ...restBody } = req.body;

    // !!! FIX IT
    // try {
    //   await schema.validateAsync({ email: req.body.email, password: req.body.password });
    // }
    // catch(err) {
    //   throw new Error(err);
    //   // Render err
    // }

    if (restBody.password === repassword) {
      // No repassword saving to database
      const user = new User(restBody);
      await user.save();
      req.logout();
      res.redirect('/auth');

    } else {
      res.redirect('/register?err=repass');
    }
  });

  // Authentication
  app.post('/auth', passport.authenticate);

  // Authentication redirect & error handling

  //* app.get('/auth', (req, res) => {
  //*   if (req.user) return res.redirect('/tasks');
  //*   const { error } = req.query;
  //*   res.render('../auth/auth-view', { error });
  //* });

  app.get('/auth', (req, res) => {
    if (req.user) return res.redirect('/tasks');
    // const { error } = req.query; //! TODO THIS
    res.sendFile(path.join(__dirname, '../public/html', 'auth.html'));
  });

  // Sign out
  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/auth');
  });
};
