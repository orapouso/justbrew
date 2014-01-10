/*
 * Company Model tests
 */

var ROOT = process.env.ROOT
  , mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'test'
  , config = require(ROOT + '/app/config/config')[env]
  , Company = mongoose.model('Company')
  , should = require('should');

describe('Company Model', function () {
  require('../helper').mongoose(mongoose, config, 'company', Company);

  var model = new Company({
    name: 'name1'
  });

  it('should save new document', function (done) {
    model.save(function (err) {
      should.not.exist(err);
      done();
    });
  });

  it('should find previously created document', function (done) {
    Company.findOne({name: 'name1'}, function (err, model1) {
      should.not.exist(err);
      model1.name.should.equal(model.name);

      Company.findById(model.id, function (err, model2) {
        should.not.exist(err);
        model2.name.should.equal(model.name);
        done();
      });
    });
  });

  it('should update previously created document', function (done) {
    var oldName = model.name;
    model.name = 'newname1';
    model.save(function (err) {
      should.not.exist(err);

      Company.findOne({name: oldName}, function (err, model1) {
        should.not.exist(err);
        should.not.exist(model1);
        done();
      });
    });
  });

  it('should remove the document', function (done) {
    model.remove(function (err) {
      should.not.exist(err);
      Company.findById(model.id, function (err, model1) {
        should.not.exist(err);
        should.not.exist(model1);
        done();
      });
    });
  });
});
