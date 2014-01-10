/*
 * Equipment Schema tests
 */

var mongoose = require('mongoose')
  , SchemaTypes = mongoose.Schema.Types
  , Equipment = mongoose.model('Equipment');

var Schema = Equipment.schema;
var treeSize = 3 + 3; //3 implicit mongoose properties

describe('Equipment Schema', function () {
  it('should have ' + treeSize + ' properties', function () {
    Object.keys(Schema.tree).length.should.equal(treeSize);
  });

  it('should have trimmed, required, string name property', function () {
    Schema.path('name').options.trim.should.be.true;
    Schema.path('name').options.required.should.be.true;
    Schema.path('name').options.type.should.be.equal(String);
  });

  it('should have trimmed, required, string description property', function () {
    Schema.path('description').options.trim.should.be.true;
    Schema.path('description').options.required.should.be.true;
    Schema.path('description').options.type.should.be.equal(String);
  });

  it('should have required, "Company" manufacturer property', function () {
    Schema.path('manufacturer').options.required.should.be.true;
    Schema.path('manufacturer').options.ref.should.equal('Company');
    Schema.path('manufacturer').should.be.instanceof(SchemaTypes.ObjectId);
  });

});
