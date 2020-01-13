const Task = require('./task-model');

module.exports = app => {
  // Create new task
  app.post('/api/tasks', (req, res) => {
    const { _id } = req.user;
    const task = new Task({ ...req.body, user: _id });  // req.body[user] = _id

    task.save()
      .then((savedTask) => {
        res.status(201).json(savedTask); 
      })
      .catch(() => {
        res.status(400).json({ message: 'Validation error' });
      });
  });

  // Read (show) all tasks
  app.get('/api/tasks', async (req, res) => {
    const { _id } = req.user;
    const { page = 1, limit = 5 } = req.query;
    const tasks = await Task.find({ user: _id }).skip((page - 1) * limit).limit(limit);
    res.status(200).json(tasks);
  });

  // Read custom task
  app.get('/api/tasks/:id', async (req, res) => {
    const task = await Task.findById(req.params.id);
    res.status(200).json(task);
  });

  // Update custom task (completely)
  app.put('/api/tasks/:id', async (req, res) => {
    const task = await Task.findOneAndUpdate({ _id: req.params.id }, { $set: req.body });
    res.status(200).json(task);
  });

  // Update custom task (fine)
  app.patch('/api/tasks/:id', async (req, res) => {
    const task = await Task.findById(req.params.id).lead();   // returns simple obj instead of Mongo's one
    const modifiedTask = await Task.findOneAndUpdate({ _id: req.params.id }, { ...task, ...req.body });
    res.status(200).json(modifiedTask);
  });
  
  // Delete custom task
  app.delete('/api/tasks/:id', async (req, res) => {
    await Task.findOneAndRemove({ _id: req.params.id });
    res.status(204).send();
  });
};
