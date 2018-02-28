const type = {
  defaultType: function () {
    return `const Joi = require('Joi');
Joi.objectId = require('joi-objectid')(Joi);
exports.register = Joi.object().keys({
  query: {},
  params: {},
  body: {

    username: Joi.string().required(),
    password: Joi.string().required(),
    firstname: Joi.string(),
    lastname: Joi.string(),
    admin: Joi.boolean()
  }
});
exports.login = Joi.object().keys({
  query: {},
  params: {},
  body: {
    username: Joi.string().required(),
    password: Joi.string().required(),
  }
});
`;
  }
};
module.exports = type;
