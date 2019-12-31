const noteRoutes = require('./note_routes');
const userRoutes = require('./user_routes');
const socket = require('./socket');
module.exports = function(app, io) {
  socket(io),
  userRoutes(app),
  noteRoutes(app)
};