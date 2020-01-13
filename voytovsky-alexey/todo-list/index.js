// Controllers
const tasks     = require('./tasks/tasks-controller');
const user      = require('./users/user-controller');

const register  = require('./register/register-rest');
const tasksRest = require('./tasks/tasks-rest');
const auth      = require('./auth/auth-rest');

module.exports = app => { 
  auth(app),
  register(app),
  tasks(app),
  tasksRest(app),
  user(app)
};
