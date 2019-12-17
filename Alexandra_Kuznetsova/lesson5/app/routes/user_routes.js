const User = require('../../models/user');
const passport = require('../../auth');
const validate = require('validate.js');

// валидация полей email и пароль
const constraints = {
  email: {
    format: {
      pattern: /^([A-Za-z0-9_\-\.]{1,})+\@([A-Za-z0-9_\-\.]{1,})+\.([A-Za-z]{2,4})$/,
      message: 'указан некорректно!'
    }
  },
  password: {
    format: {
      pattern: /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
      message: '^Пароль должен содержать строчные и прописные латинские буквы, цифры, спецсимволы. Минимум 8 символов'
    }
  }
};

module.exports = function(app, db) {

  // форма регистрации
  app.post('/register', async (req, res) => {
    const { repassword, ...restBody } = req.body;

    if ( restBody.email ) {
      const validEmail = validate({email: restBody.email}, constraints);
      if ( validEmail === undefined ) {
        if ( restBody.password ) {
          const validPass = validate({password: restBody.password}, constraints);
          if ( validPass === undefined ) {
            if ( restBody.password === repassword ) {
              const user = new User(restBody);
              await user.save();
              res.redirect('/auth');
            } else {
              const error = { error: 'Пароли не совпадают' };
              res.render('register', JSON.parse(JSON.stringify(error)));
            }
          } else {
            const error = { error: validPass.password[0] };
            res.render('register', JSON.parse(JSON.stringify(error)));
          }
        } else {
          const error = { error: 'Укажите пароль' };
          res.render('register', JSON.parse(JSON.stringify(error)));
        }
      } else {
        const error = { error: validEmail.email[0] };
        res.render('register', JSON.parse(JSON.stringify(error)));
      }
    } else {
      const error = { error: 'Укажите email' };
      res.render('register', JSON.parse(JSON.stringify(error)));
    }
    
  });

  // ошибка аутентификации
  app.get('/auth', (req, res) => {
    const { error } = req.query;
    res.render('auth', {error});
  });

  // аутентификация
  app.post('/auth', passport.authenticate);

  // выход из личного кабинета
  app.get('/logout', (req, res) => {
    req.logout();

    res.redirect('/auth');
  });

  // показать данные личного кабинета
  app.post('/user/lk', async (req, res) => {
    const { _id } = req.user;
    const user = await User.find({_id: _id});
    try {
      const age = new Date().getFullYear() - new Date(req.user.birthday).getFullYear();
      user[0].age = age;
      res.render('lk', { user });
    } catch (e) {
      let errorLk = { message: 'Ошибка при получении данных' };
      res.render('notes', JSON.parse(JSON.stringify(errorLk)));
    }
  });

  // обновить данные пользователя
  app.post('/user/update', async (req, res) => {
    const { _id } = req.user;
    const newFirstName = req.body.firstName;
    const newLastName = req.body.lastName;
    
    function bDay(param) {
      if (param === '') {
        return req.user.birthday;
      } else {
        return param;
      }
    }

    const newBirthday = bDay(req.body.birthday);
    const newPhoneNumber = req.body.phoneNumber;
  
    const newData = { firstName: newFirstName,
                      lastName: newLastName,
                      birthday: newBirthday,
                      phoneNumber: newPhoneNumber };

    await User.updateOne({_id: _id}, newData, {new: true});
  
    let message = { message: 'Данные успешно обновлены' };
    res.render('lk', JSON.parse(JSON.stringify(message)));
   });

}