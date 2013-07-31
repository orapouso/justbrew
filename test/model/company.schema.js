/*
 * Company Schema tests
 */

require('../../app/models/user');
var mongoose = require('mongoose')
  , SchemaTypes = mongoose.Schema.Types
  , Company = mongoose.model('Company')
  , should = require('should');

var Schema = Company.schema;
var treeSize = 3 + 1; //3 implicit mongoose properties

describe('Company Schema', function () {
  it('should have ' + treeSize + ' properties', function () {
    Object.keys(Schema.tree).length.should.equal(treeSize);
  });

  it('should have trimmed, required, string name property', function () {
    Schema.path('name').options.trim.should.be.true;
    Schema.path('name').options.required.should.be.true;
    Schema.path('name').options.type.should.be.equal(String);
  });

});