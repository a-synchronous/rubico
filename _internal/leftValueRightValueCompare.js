const spread2 = require('./spread2')
const isPromise = require('./isPromise')
const promiseAll = require('./promiseAll')

// leftValueRightValueCompare(
//   comparator function, left any, right any,
// ) -> Promise|boolean
const leftValueRightValueCompare = function (comparator, left, right) {
  if (isPromise(left) || isPromise(right)) {
    return promiseAll([left, right]).then(spread2(comparator))
  }
  return comparator(left, right)
}

module.exports = leftValueRightValueCompare
