/*
 * Ingredient Schema tests
 */

require('../../app/models/user');
var mongoose = require('mongoose')
  , SchemaTypes = mongoose.Schema.Types
  , Ingredient = mongoose.model('Ingredient')
  , should = require('should');

var Schema = Ingredient.schema;
var treeSize = 4 + 3; //3 implicit mongoose properties

describe('Ingredient Schema', function () {
  it('should have ' + treeSize + ' properties', function () {
    Object.keys(Schema.tree).length.should.equal(treeSize);
  });

  it('should have trimmed, required, string name property', function () {
    Schema.path('name').options.trim.should.be.true;
    Schema.path('name').options.required.should.be.true;
    Schema.path('name').options.type.should.be.equal(String);
  });

  it('should have required, checked list, String type property', function () {
    Schema.path('type').options.required.should.be.true;
    Schema.path('type').options.enum.should.be.eql(['grain', 'hop', 'yeast', 'misc']);
    Schema.path('type').options.type.should.be.equal(String);
  });

  it('should have trimmed, required, string description property', function () {
    Schema.path('description').options.trim.should.be.true;
    Schema.path('description').options.required.should.be.true;
    Schema.path('description').options.type.should.be.equal(String);
  });

  xit('should have required, "Purchase" purchases property', function () {
  });

});