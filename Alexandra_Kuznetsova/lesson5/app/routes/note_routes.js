// подключаем схему
const Task = require('../../models/task');

// функция добавления/изменения/просмотра/удаления задач коллекции
module.exports = function(app, db) {

  // рендерим страницу формы
  app.get('/tasks', (req, res) => {
    res.render('notes');
  });

  // показать все задачи коллекции
  app.post('/tasks/all', async (req, res) => {
    const { _id } = req.user;
    const tasks = await Task.find({user: _id});
    try {
      if ( tasks.length == 0 ) {
        let error = { message: 'У вас пока нет задач..' };
        res.render('notes', JSON.parse(JSON.stringify(error)));
      } else {
        res.render('notes', { tasks });
      }
    } catch (e) {
      let error = { message: 'Ошибка при получении задач :(' };
      res.render('notes', JSON.parse(JSON.stringify(error)));
    }
  });

  // получить конкретную задачу из коллекции по наименованию
  app.get('/tasks/one', async (req, res) => {
    const { _id } = req.user;
    const tasks = await Task.find({
      title: req.query.name,
      user: _id
    });
    try {
      let data = JSON.parse(JSON.stringify(tasks[0]));
      res.render('notes', data);
    } catch (e) {
      let message = { message: 'У вас нет такой задачи :(' };
      res.render('notes', JSON.parse(JSON.stringify(message)));
    }
  });

  // добавить задачу в коллекцию
  app.post('/tasks', async (req, res) => {
    const { _id } = req.user;
    const task = new Task({...req.body, user: _id});
    const savedTask = await task.save();
    let data = JSON.parse(JSON.stringify(savedTask));
    res.render('notes', data);
  });

  // удалить задачу из коллекции
  app.post('/tasks/delete', async (req, res) => {
    const { id } = req.body;
    await Task.findByIdAndRemove(id);
    let message = { message: 'Ваша задача успешно удалена' };
    res.render('notes', JSON.parse(JSON.stringify(message)));
  });

  // обновить данные задачи в коллекции
  app.post('/tasks/put', async (req, res) => {
    const id = req.body.id;
    const newTitle = req.body.title;
    const newBody = req.body.body;
  
    function getStatus(param) {
      if ( param === 'on' ) {
        return param = true;
      } else {
        return param = false;
      }
    }
    
    const newPriority = getStatus(req.body.priority);
    const newCompleted = getStatus(req.body.completed);
    const newTask = {title: newTitle, body: newBody, priority: newPriority, completed: newCompleted};

    await Task.updateOne({_id: id}, newTask, {new: true});

    let message = { message: 'Данные успешно обновлены' };
    res.render('notes', JSON.parse(JSON.stringify(message)));
   });

}
