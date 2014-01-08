
/**
 * Module dependencies
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
/**
 * Company Schema
 */

var CompanySchema = new Schema({
  name: { type: String, required: true, trim: true }
}, { collection: 'companies' });


mongoose.model('Company', CompanySchema);
