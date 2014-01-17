/**
 * Ingredients Controller
 */
var mongoose = require('mongoose'),
    HTTP_STATUS = require('../helpers/http-status'),
    Company = mongoose.model('Company');

exports.query = function (req, res, next) {
  Company.find(function (err, list) {
    if (err) { return next(err); }

    return res.json(HTTP_STATUS.OK, list);
  });
};

exports.get = function (req, res, next) {
  var id = req.params.id;

  Company.findById(id, function (err, item) {
    if (err) { return next(err); }

    if (!item) {
      return res.json(HTTP_STATUS.NOT_FOUND, {});
    }

    return res.json(HTTP_STATUS.OK, item);
  });
};

exports.post = function (req, res, next) {
  var company = new Company(req.body);

  company.save(function (err, company2) {
    if (err) {
      if (err.name === 'ValidationError') {
        return res.json(HTTP_STATUS.BAD_REQUEST, err.errors);
      }

      return next(err);
    }

    return res.json(HTTP_STATUS.OK, company2);
  });
};
