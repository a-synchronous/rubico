const spread2 = require('./spread2')
const isPromise = require('./isPromise')
const promiseAll = require('./promiseAll')

// leftResolverRightResolverCompare(
//   args Array, comparator function, left function, right function,
// ) -> Promise|boolean
const leftResolverRightResolverCompare = function (
  args, comparator, left, right,
) {
  const leftResult = left(...args),
    rightResult = right(...args)
  if (isPromise(leftResult) || isPromise(rightResult)) {
    return promiseAll([leftResult, rightResult]).then(spread2(comparator))
  }
  return comparator(leftResult, rightResult)
}

module.exports = leftResolverRightResolverCompare
