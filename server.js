
/**
 * Module dependencies
 */
require('./config/util');
var express = require('express')
  , passport = require('passport')
  , env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]
  , mongoose = require('mongoose')
  , modelsPath = __dirname + '/app/models';

mongoose.connect(config.db);

// Bootstrap models
require('fs').readdirSync(modelsPath).forEach(function (file) {
  require(modelsPath + '/' + file);
});

// Bootstrap passport config
require('./config/passport')(passport, config);

var app = express();

// Bootstrap application settings
require('./config/express')(app, config, passport);

// Bootstrap routes
require('./config/routes')(app, passport);

// Start the app by listening on <port>
if (env !== 'test') {
  var port = process.env.PORT || config.app.port;
  app.listen(port);
  console.log('Express app started on port ' + port + ' in ' + env + ' mode');
} else {
  module.exports.app = app;
}