const jwt  = require('jsonwebtoken');
const User = require('../users/user-model');

// !!! Disable cache in browser (network)

module.exports = app => {
  // Authentication
  app.post('/api/auth', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ email: username });

    if (!user || !user.validatePassword(password)) {
      return res.status(401).send('User unregistred or incorrect password! Please, check it out.');
    }

    const plainUser = JSON.parse(JSON.stringify(user));
    delete plainUser.password;

    res.status(200).json({ ...plainUser, token: jwt.sign(plainUser, '9UwBWnYD') });
  });
};
