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

      function getBodyTask(param, mes) {
        if (param === true) {
          return mes;
        } else {
          return '';
        }
      }
      const mesCompleted = getBodyTask(data.completed, 'Задача завершена');
      const mesPriority = getBodyTask(data.priority, 'Задача в приоритете');
      
      let obj = {
        _id: data._id,
        title: data.title,
        body: data.body,
        date: data.date,
        completed: data.completed,
        priority: data.priority,
        messageC: mesCompleted,
        messageP: mesPriority,
        __v: data.__v
      }
      
      res.render('notes', obj);
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

    const tasks = await Task.updateOne({
      _id: id},
      newTask,
      {new: true
    });
    let message = { message: 'Данные успешно обновлены' };
    res.render('notes', JSON.parse(JSON.stringify(message)));
   });

}
