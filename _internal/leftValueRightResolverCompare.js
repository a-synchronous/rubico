const spread2 = require('./spread2')
const isPromise = require('./isPromise')
const promiseAll = require('./promiseAll')

// leftValueRightResolverCompare(
//   args Array, comparator function, left any, right any,
// ) -> Promise|boolean
const leftValueRightResolverCompare = function (args, comparator, left, right) {
  const rightResult = right(...args)
  if (isPromise(left) || isPromise(rightResult)) {
    return promiseAll([left, rightResult]).then(spread2(comparator))
  }
  return comparator(left, rightResult)
}

module.exports = leftValueRightResolverCompare
