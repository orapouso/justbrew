
/**
 * Module dependencies
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
/**
 * Purchase Schema
 */

var PurchaseSchema = new Schema({
  quantity: { type: Number, required: true, min: 0.0 },
  available: { type: Number, min: 0.0 },
  date: { type: Date, required: true, default: Date.now },
  unit: { type: String, required: true, enum: ['kg', 'g', 'mg', 'l', 'ml'] }
}, { collection: 'purchases' });


mongoose.model('Purchase', PurchaseSchema);
