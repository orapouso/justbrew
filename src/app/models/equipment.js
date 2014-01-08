
/**
 * Module dependencies
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
/**
 * Equipment Schema
 */

var EquipmentSchema = new Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  manufacturer: { type: Schema.ObjectId, ref: 'Company', required: true }
}, { collection: 'equipments' });


mongoose.model('Equipment', EquipmentSchema);
