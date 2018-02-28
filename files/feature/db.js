function jsUcfirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const db = {
  defaultDb: function () {
    return `const User = require('./user.model.js');
const log = require('@common/log');
exports.findAllUser = function () {
  return new Promise(function (resolve, reject) {
    User.find({}, function (err, users) {
      if (err) {
        log(err);
        return reject(err);
      } else {
        resolve(users);
      }

    });
  });
};
exports.registerUser = function (req) {
  return new Promise(function (resolve, reject) {
    User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
      if (err) {
        return reject(err);
      } else {
        if (req.body.firstname) {
          user.firstname = req.body.firstname;
        }
        if (req.body.lastname) {
          user.lastname = req.body.lastname;
        }
        if (req.body.admin) {
          user.admin = req.body.admin;
        }
        user.save(function (err) {
          if (err) {
            reject(err);
          } else {
            resolve(user);
          }
        });
      }
    });
  });
};
exports.verifyUser = function (req) {
  return new Promise(function (resolve, reject) {
    User.findById(req._user._id, function (err, user) {
      if (err) {
        return reject(err);
      } else {
        resolve(user);
      }

    });
  });
};
`;
  },
  makeBasicdb: function (name) {
    return `const ${name} = require('./${name}.model.js');
const log = require('@common/log');
exports.findAll${jsUcfirst(name)}= function () {
  return new Promise(function (resolve, reject) {
     ${name}.find({}, function (err, users) {
      if (err) {
        log(err);
        return reject(err);
      } else {
        resolve(users);
      }
    });
  });
};
`;
  },
  makeRoutedb: function (methodName, queryModel, query, name) {
    return `exports.${methodName} = function () {
  return new Promise(function (resolve, reject) {
     ${queryModel}.${query}({},  function (err, data) {
      if (err) {
        log(err);
        return reject(err);
      } else {
        resolve(data);
      }
    });
  });`;

  }
};
module.exports = db;
