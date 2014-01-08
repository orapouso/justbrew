/*
 * Purchase Schema tests
 */

require('../../app/models/user');
var mongoose = require('mongoose')
  , SchemaTypes = mongoose.Schema.Types
  , Purchase = mongoose.model('Purchase')
  , should = require('should');

var Schema = Purchase.schema;
var treeSize = 4 + 3; //3 implicit mongoose properties

describe('Purchase Schema', function () {
  it('should have ' + treeSize + ' properties', function () {
    Object.keys(Schema.tree).length.should.equal(treeSize);
  });

  it('should have required, checked minimum, number quantity property', function () {
    Schema.path('quantity').options.required.should.be.true;
    Schema.path('quantity').options.min.should.be.equal(0.0);
    Schema.path('quantity').options.type.should.be.equal(Number);
  });

  it('should have checked minimum, number available property', function () {
    Schema.path('available').options.min.should.be.equal(0.0);
    Schema.path('available').options.type.should.be.equal(Number);
  });

  it('should have required, set default, Date date property', function () {
    Schema.path('date').options.required.should.be.true;
    Schema.path('date').options.default.should.be.equal(Date.now);
    Schema.path('date').options.type.should.be.equal(Date);
  });

  it('should have required, checked list, String unit property', function () {
    Schema.path('unit').options.required.should.be.true;
    Schema.path('unit').options.enum.should.be.eql(['kg', 'g', 'mg', 'l', 'ml']);
    Schema.path('unit').options.type.should.be.equal(String);
  });
});