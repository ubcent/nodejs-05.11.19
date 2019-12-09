// подключаем схему
const Task = require('../../models/task');

// функция добавления/изменения/просмотра/удаления заметок коллекции
module.exports = function(app, db) {

  // получить заметку из коллекции
  app.get('/tasks', async (req, res) => {
    const tasks = await Task.find({
      title: req.query.name
    });
    try {
      let data = JSON.parse(JSON.stringify(tasks[0]));
      res.render('notes', data);
    } catch (e) {
      let message = { message: 'У вас нет такой заметки :(' };
      res.render('notes', JSON.parse(JSON.stringify(message)));
    }
  });

  // добавить заметку в коллекцию
  app.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    const savedTask = await task.save();
    let data = JSON.parse(JSON.stringify(savedTask));
    res.render('notes', data);
  });

  // удалить заметку из коллекции
  app.get('/delete', async (req, res) => {
    const tasks = await Task.deleteMany({
      title: req.query.name
    });
    let message = { message: 'Ваша заметка успешно удалена' };
    res.render('notes', JSON.parse(JSON.stringify(message)));
  });

  // обновить данные заметки в коллекции
  app.post('/put', async (req, res) => {
    const id = req.body.id;
    const newTitle = req.body.title;
    const newBody = req.body.body;
    const newTask = {title: newTitle, body: newBody};

    const tasks = await Task.updateOne({
      _id: id},
      newTask,
      {new: true
    });
    let message = { message: 'Данные успешно обновлены' };
    res.render('notes', JSON.parse(JSON.stringify(message)));
  });

}