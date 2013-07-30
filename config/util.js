module.exports.toArray = function (obj) {
  var arr = [];
  if (!obj) { return arr; }
  Object.keys(obj).forEach(function (v) {
    arr.push(obj[v]);
  });

  return arr;
};

Date.prototype.toJSON = function () {
  return this.getTime();
};