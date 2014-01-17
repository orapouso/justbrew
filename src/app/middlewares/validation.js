var httpStatus = require('../helpers/http-status');

exports.checkURLParams = checkParams('params');

exports.checkBodyParams = checkParams('body');

function checkParams(where) {
  return function (params) {
    return function (req, res, next) {
      var errors = [];

      for (var param in params) {
        if (params.hasOwnProperty(param)) {

          if (!req[where][param]) {
            errors.push({
              name: 'URLParamError',
              value: req[where][param] || '',
              path: param,
              message: param + ' param is empty'
            });
          } else {
            if (typeof param === 'number' && !/[0-9]/.test(req[where][param])) {
              errors.push({
                name: 'URLParamError',
                expected: (typeof param),
                value: req[where][param],
                path: param,
                message: param + ' param is not a ' + (typeof param)
              });
            }
          }
        }
      };

      if (errors.length > 0) {
        return res.json(httpStatus.BAD_REQUEST, { errors: errors });
      }

      next();
    };
  };
};


