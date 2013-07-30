require('../app/models/user');
var env = process.env.NODE_ENV || 'development'
  , config = require('../config/config')[env]
  , mongoose = require('mongoose')
  , User = mongoose.model('User');

mongoose.connect(config.db);

exports.up = function (next) {
  new User({
    name: 'admin',
    email: 'orapouso@gmail.com',
    username: 'admin',
    password: 'rootroot',
    passwordConfirm: 'rootroot'
  }).save(function (err) {
    next(err);
  });
};

exports.down = function (next) {
  User.findOneAndRemove({username: 'admin'}, function (err) {
    if (err) { return next(err); }
  });
};
