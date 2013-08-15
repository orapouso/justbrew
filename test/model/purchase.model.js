/*
 * Purchase Model tests
 */

var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'test'
  , config = require('../../config/config')[env]
  , Purchase = mongoose.model('Purchase')
  , should = require('should');

describe('Purchase Model', function () {
  require('../helper').mongoose(mongoose, config, 'purchase', Purchase);

  var model = new Purchase({
    quantity: 2.5,
    available: 2.5,
    unit: 'g',
  });

  it('should save new document', function (done) {
    model.save(function (err) {
      should.not.exist(err);
      done();
    });
  });

  it('should find previously created document', function (done) {
    Purchase.findOne({ quantity: 2.5, available: 2.5, unit: 'g'}, function (err, model1) {
      should.not.exist(err);
      model1.date.getTime().should.equal(model.date.getTime());

      Purchase.findById(model.id, function (err, model2) {
        should.not.exist(err);
        model2.date.getTime().should.equal(model.date.getTime());
        done();
      });
    });
  });

  it('should update previously created document', function (done) {
    var oldAvailable = model.available;
    model.available = 0.5;
    model.save(function (err) {
      should.not.exist(err);

      Purchase.findOne({available: oldAvailable}, function (err, model1) {
        should.not.exist(err);
        should.not.exist(model1);
        done();
      });
    });
  });

  it('should remove the document', function (done) {
    model.remove(function (err) {
      should.not.exist(err);
      Purchase.findById(model.id, function (err, model1) {
        should.not.exist(err);
        should.not.exist(model1);
        done();
      });
    });
  });
});