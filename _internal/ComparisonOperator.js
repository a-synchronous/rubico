const areAnyValuesPromises = require('./areAnyValuesPromises')
const curryArgs4 = require('./curryArgs4')
const promiseAll = require('./promiseAll')
const __ = require('./placeholder')
const leftResolverRightResolverCompare = require('./leftResolverRightResolverCompare')
const leftResolverRightValueCompare = require('./leftResolverRightValueCompare')
const leftValueRightResolverCompare = require('./leftValueRightResolverCompare')

// ComparisonOperator(comparator function) -> operator function
const ComparisonOperator = comparator => function operator(...args) {
  const right = args.pop()
  const left = args.pop()
  const isLeftResolver = typeof left == 'function',
    isRightResolver = typeof right == 'function'

  if (isLeftResolver && isRightResolver) {
    if (args.length == 0) {
      return curryArgs4(
        leftResolverRightResolverCompare, __, comparator, left, right,
      )
    }
    if (areAnyValuesPromises(args)) {
      return promiseAll(args).then(curryArgs4(
        leftResolverRightResolverCompare, __, comparator, left, right,
      ))
    }
    return leftResolverRightResolverCompare(args, comparator, left, right)
  }

  if (isLeftResolver) {
    return curryArgs4(
      leftResolverRightValueCompare, __, comparator, left, right,
    )
  }

  if (isRightResolver) {
    return curryArgs4(
      leftValueRightResolverCompare, __, comparator, left, right,
    )
  }

  return comparator(left, right)
}


module.exports = ComparisonOperator
