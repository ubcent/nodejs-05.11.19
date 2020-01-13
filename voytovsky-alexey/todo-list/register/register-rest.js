const User = require('../users/user-model');

module.exports = app => {
  // Registration
  app.post('/api/register', async (req, res) => {
    const { repassword, ...restBody } = req.body;
    const { email, password } = restBody;
    const userExists = await User.findOne({ email: email });

    if (!userExists && password === repassword) {
      const user = new User(restBody);
      await user.save();
      res.status(201).send();

    } else if (restBody.password !== repassword) {
      res.status(400).json({ message: 'Password re-entry is incorrect!' });
      
    } else {
      res.status(400).json({ message: 'User exists' });
    }
  });
};
