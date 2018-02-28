let ctrl = ``;

module.exports = ctrl;
const makeCtrl = {
  defaultctrl: function () {
    const dctrl = `const passport = require('passport');
const log = require('@common/log');
const auth = require('@common/auth');
const serverMessages = require('@common/messages');
const userData = require('./user.db');
const Boom = require('Boom');
exports.listAll = async function (req, res, next) {
  const params = { ...req };
  await userData.findAllUser(params).then(users => {
    if (users.length === 0) {
      return next({
        message: serverMessages.user.ERROR_NO_USER,
        data: {}
      });
    }
    return res.json({
      message: serverMessages.user.SUCCESS_FOUND,
      success: true,
      data: users
    });
  }).catch(err => {
    if (err) {
      throw Boom.badImplementation(\`DB error\`);
    }
  });
};

exports.register = async function (req, res) {
  const params = { ...req };
  await userData.registerUser(params);
  try {
    passport.authenticate(\`local\`)(req, res, function () {
      return res.json({
        message: serverMessages.user.SUCCESS_REGISTER,
        success: true,
        data: null
      });
    });
  } catch (err) {
    if (err) {
      throw Boom.badImplementation(\`DB error\`);
    }
  }
};

exports.login = function (req, res, next) {

  passport.authenticate(\`local\`, function (err, user, info) {
    log(err, user, info);
    if (err) {
      return Boom.badImplementation('DB ERROR');
    }
    if (info) {
      return Boom.unauthorized('Auth error');
    }
    if (!user) {
      return next({
        message: serverMessages.user.ERROR_NO_USER,
        data: null
      });
    }

    req.logIn(user, function (err) {
      log(err);

      if (err) {
        return Boom.forbidden('Login error');
      }

      auth.getLoginData(user).then(function (data) {

        return res.json({
          message: serverMessages.user.SUCCESS_LOGIN,
          success: true,
          data: data
        });
      }, function (err) {
        if (err) {
          return Boom.forbidden('Login error');
        }

      }).catch(err => {
        log(err);
      });

    });
  })(req, res, next);
};

exports.verifyUser = async function (req, res, next) {
  const param = { ...req };
  await userData.verifyUser(param).then(user => {
    if (user.length === 0) {
      return next({
        message: serverMessages.user.ERROR_NO_USER,
        data: {}
      });
    }
    auth.getLoginData(user).then(function (data) {
      return res.json({
        message: serverMessages.user.SUCCESS_VERIFY,
        success: true,
        data: data
      });
    }).catch(err => {
      if (err) {
        Boom.badImplementation('Error get user data');
      }
    });
  });
};

exports.logout = function (req, res) {
  req.logout();
  res.json({
    message: serverMessages.user.SUCCESS_LOGOUT,
    success: true,
    data: null
  });
};

    
  `;
    return dctrl;
  },
  makeBasicCtrl: function (name) {

    ctrl = `const ${name}  = require('./${name}.model.js');
    const passport = require('passport');
    const log = require('@common/log');
    const auth = require('@common/auth');
    const serverCodes = require('@common/codes');
    const serverMessages = require('@common/messages');
                exports.listAll = function (req, res, next) {
                  ${name}.find({}, function (err, users) {
                    if (err) throw err;
                    res.json(users);
                  });
                };
                `;

    return ctrl;

  },

  makerouteCtrl: function (name, query, queryModel, methodName) {

    ctrl = ` exports.${methodName}= function (req, res, next) {
                   ${queryModel}.${query}({}, function (err,data ) {
                     if (err) {
                        return res.status(500).json({
                          err: err
                        });
                      }
                      return res.status(200).json({
                        message: '',
                        success: true,
                        data: data 
                      });
               
                  });
                }
                
                
                `;

    return ctrl;

  }

};

module.exports = makeCtrl;
