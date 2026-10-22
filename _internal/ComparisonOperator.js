const isPromise = require('./isPromise')
const areAnyValuesPromises = require('./areAnyValuesPromises')
const __ = require('./placeholder')
const curry2 = require('./curry2')
const curry3 = require('./curry3')
const curry4 = require('./curry4')
const curryArgs4 = require('./curryArgs4')
const spread2 = require('./spread2')
const promiseAll = require('./promiseAll')
const leftResolverRightResolverCompare = require('./leftResolverRightResolverCompare')
const leftResolverRightValueCompare = require('./leftResolverRightValueCompare')
const leftValueRightResolverCompare = require('./leftValueRightResolverCompare')
const leftValueRightValueCompare = require('./leftValueRightValueCompare')

// ComparisonOperator(comparator function) -> operator function
const ComparisonOperator = comparator => function operator(...args) {
  if (args.length < 2) {
    return curry3(leftValueRightValueCompare, comparator, args[0], __)
  }

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
      return promiseAll(args).then(curry4(
        leftResolverRightResolverCompare, __, comparator, left, right,
      ))
    }
    return leftResolverRightResolverCompare(args, comparator, left, right)
  }

  if (isLeftResolver) {
    if (args.length == 0) {
      return curryArgs4(
        leftResolverRightValueCompare, __, comparator, left, right,
      )
    }
    if (areAnyValuesPromises(args)) {
      return promiseAll(args).then(curry4(
        leftResolverRightValueCompare, __, comparator, left, right,
      ))
    }
    return leftResolverRightValueCompare(args, comparator, left, right)
  }

  if (isRightResolver) {
    if (args.length == 0) {
      return curryArgs4(
        leftValueRightResolverCompare, __, comparator, left, right,
      )
    }
    if (areAnyValuesPromises(args)) {
      return promiseAll(args).then(curry4(
        leftValueRightResolverCompare, __, comparator, left, right,
      ))
    }
    return leftValueRightResolverCompare(args, comparator, left, right)
  }

  if (isPromise(left) || isPromise(right)) {
    return promiseAll([left, right]).then(spread2(comparator))
  }
  return comparator(left, right)
}


module.exports = ComparisonOperator
