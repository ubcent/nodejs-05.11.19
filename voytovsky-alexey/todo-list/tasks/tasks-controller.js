const Task = require('./task-model');
module.exports = app => {
  // Create new task
  app.post('/tasks', async (req, res) => {
    const { _id } = req.user;
    const task = new Task({ ...req.body, user: _id, time: Date() });  // req.body[user] = _id
    await task.save();
    res.redirect('/tasks');
  });

  // Read (show) all tasks
  app.get('/tasks', async (req, res) => {
    const { _id } = req.user;
    const tasks = await Task.find({ user: _id });
    res.render('../tasks/tasks-view', { tasks, title: 'ToDo List' });
  });

  // Update (change) task state
  app.post('/tasks/complete/', async (req, res) => {
    const { id } = req.body;
    const task = await Task.findById(id);
    task.completed ?  await Task.updateOne({ _id: id }, { completed: false })
                   :  await Task.updateOne({ _id: id }, { completed: true });
    res.redirect('/tasks');
  });

  // Update (edit) task
  app.get('/tasks/:id', async (req, res) => {
    const { id } = req.params;
    const task = await Task.findById(id);
    res.render('../tasks/task-view', task);
  });

  app.post('/tasks/update', async (req, res) => {
    const { id, title } = req.body;
    await Task.updateOne({ _id: id }, { title });
    res.redirect('/tasks');
  });
  
  // Delete task
  app.post('/tasks/remove/', async (req, res) => {
    const { id } = req.body;
    await Task.findByIdAndRemove(id);
    res.redirect('/tasks');
  });
};
