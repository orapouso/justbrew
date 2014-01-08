/**
 *
 * Configuration file overriding
 *
 */
var userConfig = require('../../user-config');

function extend(dest, from) {
  var props = Object.getOwnPropertyNames(from), destination;

  props.forEach(function (name) {
    if (typeof from[name] === 'object') {
      if (typeof dest[name] !== 'object') {
        dest[name] = {};
      }
      extend(dest[name], from[name]);
    } else {
      if (dest[name] === undefined) {
        destination = Object.getOwnPropertyDescriptor(from, name);
        Object.defineProperty(dest, name, destination);
      }
    }
  });
}

//Development inherits configuration from production
extend(userConfig.development, userConfig.production);

//Test inherits configuration from production and development
extend(userConfig.test, userConfig.development);

module.exports = userConfig;
