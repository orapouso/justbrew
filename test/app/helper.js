exports.mongoose = function (mongoose, config, test) {

  var models = [].slice.call(arguments, 3);

  function clearCollections(disconnect, done) {
    var completed = 0;
    if (models.length === 0) {
      done();
    } else {
      models.forEach(function (m) {
        m.remove({}, function () {
          completed++;
          if (completed >= models.length) {
            if (disconnect === true) {
              mongoose.connection.db.dropDatabase();
              mongoose.disconnect(done);
            } else {
              done();
            }
          }
        });
      });
    }
  }

  before(function (done) {
    mongoose.connect(config.db + '_' + test);
    clearCollections(false, done);
  });

  after(function (done) {
    if (config.clearCollectionsAfter) {
      clearCollections(true, done);
    } else {
      mongoose.disconnect();
      done();
    }
  });

  return {
    stubUser: function (callback) {
      new (mongoose.model('User'))({
        name: 'User1',
        email: 'valid@ema.il',
        username: 'valid_username',
        password: 'valid_password',
        passwordConfirm: 'valid_password'
      }).save(function (err, user) {
        callback(user);
      });
    }
  };
};