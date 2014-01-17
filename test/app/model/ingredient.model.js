/*
 * Ingredient Model tests
 */

var ROOT = process.env.ROOT
  , mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'test'
  , config = require(ROOT + '/app/config/config')[env]
  , Purchase = mongoose.model('Purchase')
  , Ingredient = mongoose.model('Ingredient')
  , should = require('should');

describe('Ingredient Model', function () {
  require('../helper').mongoose(mongoose, config, 'ingredient', Purchase, Ingredient);

  var purchase = new Purchase({
    quantity: 2.5,
    available: 2.5,
    unit: 'kg',
  });

  var model = new Ingredient({
    name: 'name1',
    type: 'grain',
    description: 'description1'
  });

  it('should save new document', function (done) {
    model.save(function (err) {
      should.not.exist(err);
      done();
    });
  });

  it('should find previously created document', function (done) {
    Ingredient.findOne({name: 'name1'}, function (err, model1) {
      should.not.exist(err);
      model1.name.should.equal(model.name);

      Ingredient.findById(model.id, function (err, model2) {
        should.not.exist(err);
        model2.name.should.equal(model.name);
        done();
      });
    });
  });

  it('should update', function (done) {
    var oldName = model.name;
    model.name = 'newname1';

    model.save(function (err, model1) {
      should.not.exist(err);
      model1.name.should.equal('newname1');

      Ingredient.findOne({name: oldName}, function (err, model2) {
        should.not.exist(err);
        should.not.exist(model2);
        done();
      });
    });
  });

  it('should add new purchase to purchases list', function (done) {
    new Purchase({
      quantity: 15,
      available: 15,
      unit: 'kg',
    }).save(function (err, purchase) {
      should.not.exist(err);
      model.purchases.push(purchase);

      model.save(function (err) {
        should.not.exist(err);

        Ingredient.findOne({name: model.name}, function (err, model1) {
          should.not.exist(err);
          model1.purchases.length.should.equal(1);
          model1.purchases[0].should.eql(purchase._id);
          done();
        });
      });
    });
  });

  it('should remove the document', function (done) {
    model.remove(function (err) {
      should.not.exist(err);
      Ingredient.findById(model.id, function (err, model1) {
        should.not.exist(err);
        should.not.exist(model1);
        done();
      });
    });
  });
});