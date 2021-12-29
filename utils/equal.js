const deepEqual = function (x, y) {
  if (x == null || x == 'null')
    return false
  return JSON.stringify(x) == JSON.stringify(y)
  // return (x && y && typeof x === 'object' && typeof y === 'object') ?
  //   (Object.keys(x).length === Object.keys(y).length) &&
  //     Object.keys(x).reduce(function(isEqual, key) {
  //       return isEqual && deepEqual(x[key], y[key]);
  //     }, true) : (x === y);
};

module.exports = {
  deepEqual
}