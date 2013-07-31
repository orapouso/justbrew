/*
 * Equipment Model tests
 */

var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'test'
  , config = require('../../config/config')[env]
  , Company = mongoose.model('Company')
  , Equipment = mongoose.model('Equipment')
  , should = require('should');

describe('Equipment Model', function () {
  require('../helper').mongoose(mongoose, config, 'equipment', Company, Equipment);

  var company = new Company({
    name: 'company1'
  });

  var model = new Equipment({
    name: 'name1',
    description: 'description1',
    manufacturer: company
  });

  it('should save new document', function (done) {
    model.save(function (err) {
      should.not.exist(err);
      done();
    });
  });

  it('should find previously created document', function (done) {
    Equipment.findOne({name: 'name1'}, function (err, model1) {
      should.not.exist(err);
      model1.name.should.equal(model.name);

      Equipment.findById(model.id, function (err, model2) {
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

      Equipment.findOne({name: oldName}, function (err, model1) {
        should.not.exist(err);
        should.not.exist(model1);
        done();
      });
    });
  });

  it('should remove the document', function (done) {
    model.remove(function (err) {
      should.not.exist(err);
      Equipment.findById(model.id, function (err, model1) {
        should.not.exist(err);
        should.not.exist(model1);
        done();
      });
    });
  });
});