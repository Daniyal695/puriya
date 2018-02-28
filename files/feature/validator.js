const valiator = {
  defaultValidate: function () {
    return `// User Package Requires
const serverMessages = require('@common/messages');
const schema = require('./user.type');
const validate = require('@common/validator').validate;
exports.register = function (req, res, next) {
  const incomingData = {
    query: {},
    params: {},
    body: {
      username: req.body.username,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      admin: req.body.admin
    }
  };
  validate(incomingData, schema.register).then(value => {
    req.body = value.body;
    req.params = value.params;
    req.query = value.query;

    next();
  })
    .catch(err => {
      if (err) {
        return next({
          message: serverMessages.server.VALIDATION_ERROR,
          data: err
        });
      }
    });
};
exports.login = function (req, res, next) {
  const incomingData = {
    query: {},
    params: {},
    body: {
      username: req.body.username,
      password: req.body.password
    }
  };
  validate(incomingData, schema.login).then(value => {
    req.body = value.body;
    req.params = value.params;
    req.query = value.query;

    next();
  })
    .catch(err => {
      if (err) {
        return next({
          message: serverMessages.server.VALIDATION_ERROR,
          data: err
        });
      }
    });
};
`;
  }
};
module.exports = valiator;
