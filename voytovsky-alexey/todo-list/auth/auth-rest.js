const jwt  = require('jsonwebtoken');
const User = require('../users/user-model');


module.exports = app => {
  // Authentication
  app.post('/api/auth', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ email: username });

      if (!user) {
        return res.status(401);
      } else if (!user.validatePassword(password)) {   //!!! It doesn't work here (without passport.js strategy)
        console.error('FIX HERE!');
        return res.status(401);
      }

      const plainUser = JSON.parse(JSON.stringify(user));
      delete plainUser.password;

      res.status(200).json({ ...plainUser, token: jwt.sign(plainUser, '9UwBWnYD') });
  });
};
