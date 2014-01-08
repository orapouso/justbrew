var httpStatus = require('../helpers/http-status');

exports.checkURLParams = function () {
  var params = Array.prototype.slice.call(arguments);
  return function (req, res, next) {
    var errors = [];

    params.forEach(function (param) {
      if (!req.params[param.name]) {
        errors.push({
          name: 'URLParamError',
          value: req.params[param.name] || '',
          path: param.name,
          message: param.name + ' param is empty'
        });
      } else {
        if (typeof param.type === 'number' && !/[0-9]/.test(req.params[param.name])) {
          errors.push({
            name: 'URLParamError',
            expected: (typeof param.type),
            value: req.params[param.name],
            path: param.name,
            message: param.name + ' param is not a ' + (typeof param.type)
          });
        }
      }
    });

    if (errors.length > 0) {
      return res.json(httpStatus.BAD_REQUEST, { errors: errors });
    }

    next();
  };
};