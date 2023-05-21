const spread2 = require('./spread2')
const isPromise = require('./isPromise')
const promiseAll = require('./promiseAll')

// leftResolverRightValueCompare(
//   args Array, comparator function, left function, right any
// ) -> Promise|boolean
const leftResolverRightValueCompare = function (args, comparator, left, right) {
  const leftResult = left(...args)
  if (isPromise(leftResult) || isPromise(right)) {
    return promiseAll([leftResult, right]).then(spread2(comparator))
  }
  return comparator(leftResult, right)
}

module.exports = leftResolverRightValueCompare
