const nodemailer = require('nodemailer');

const smtpTransport = nodemailer.createTransport('SMTP', {
  service: 'Gmail',
  auth: {
    user: 'vasya@gmail.com',
    pass: '*****',
  }
});

smtpTransport.sendMail({
  from: 'Vasya Pupkin <vasya@gmail.com>',
  to: 'petya@pupkin.ru, kolya@pupkin.ru',
  subject: 'Семейное торжество братьев Пупкиных',
  text: 'Привет всем!',
  html: '<b>Привет</b> всем!',
}, (err, res) => {
  if (err) {
    throw err;
  }

  console.log('Letter has been sent', res.message);

  // smtpTransport.close();
});