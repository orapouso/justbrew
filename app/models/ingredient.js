
/**
 * Module dependencies
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;
/**
 * Ingredient Schema
 */

var IngredientSchema = new Schema({
  name: { type: String, required: true, trim: true },
  type: { type: String, required: true, trim: true, enum: ['grain', 'hop', 'yeast', 'misc'] },
  description: { type: String, required: true, trim: true },
  purchases: [{ type: Schema.ObjectId, ref: 'Purchase', required: true }]
}, { collection: 'ingredients' });


mongoose.model('Ingredient', IngredientSchema);
