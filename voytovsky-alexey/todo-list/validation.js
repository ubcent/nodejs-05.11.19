// Form validation
const Joi = require('@hapi/joi');

exports.schema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ru'] } })
    .alphanum()
    .min(3)
    .max(15)
    .required(),

  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

  repeat_password: Joi.ref('password'),

})
  .with('password', 'repeat_password');
