// Controllers
const tasks   = require('./tasks/tasks-controller');
const user    = require('./users/user-controller');

module.exports = app => { tasks(app), user(app) };
