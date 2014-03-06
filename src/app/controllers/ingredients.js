/**
 * Ingredients Controller
 */
var mongoose = require('mongoose'),
    Ingredient = mongoose.model('Ingredient');

exports.index = function(req, res) {
    Ingredient.find(function(err, ingredientList) {
        res.render('ingredients/index', {
            title: 'Justbrew - Ingredients',
            ingredients: ingredientList
        });
    });
};