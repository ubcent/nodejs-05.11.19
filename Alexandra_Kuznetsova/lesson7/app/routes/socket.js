const jwt = require('jsonwebtoken');
const Task = require('../../models/task');

module.exports = function(io) {

  io.use((socket, next) => {
    const token = socket.handshake.query.token;
    jwt.verify(token, 'super secret key', (err) => {
      if (err) {
        return next(new Error('authentication error'));
      }

      next();
    });

    return next(new Error('authentication error'));
  });

  io.on('connection', (socket) => {
    console.log('Someone has connected!');

    socket.on('create', async (data) => {
      const task = new Task(data);
      const savedTask = await task.save();

      socket.broadcast.emit(`created:${savedTask.user}`, savedTask);
      socket.emit(`created:${savedTask.user}`, savedTask);
    });

    socket.on('toggle', async (taskId) => {
      const task = await Task.findById(taskId);

      await Task.findOneAndUpdate({ _id: taskId }, { $set: { completed: !task.completed } });

      socket.broadcast.emit(`toggled:${task.user}`, taskId);
      socket.emit(`toggled:${task.user}`, taskId);
    });

    socket.on('change', async (taskId) => {
      const task = await Task.findById(taskId);

      await Task.findOneAndUpdate({ _id: taskId }, { $set: { priority: !task.priority } });

      socket.broadcast.emit(`changed:${task.user}`, taskId);
      socket.emit(`changed:${task.user}`, taskId);
    });

    socket.on('disconnect', () => {
      console.log('Someone has disconnected!');
    });
  });

}