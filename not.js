const areAnyValuesPromises = require('./_internal/areAnyValuesPromises')
const isPromise = require('./_internal/isPromise')
const promiseAll = require('./_internal/promiseAll')
const __ = require('./_internal/placeholder')
const curry2 = require('./_internal/curry2')
const curryArgs2 = require('./_internal/curryArgs2')

// negate(value boolean) -> inverse boolean
const negate = value => !value

// _not(args Array, predicate function)
const _not = function (args, predicate) {
  const boolean = predicate(...args)
  return isPromise(boolean) ? boolean.then(negate) : !boolean
}

/**
 * @name not
 *
 * @synopsis
 * ```coffeescript [specscript]
 * not(value boolean) -> negated boolean
 *
 * not(...args, predicate function) -> negated boolean
 *
 * not(predicate function)(...args) -> negated boolean
 * ```
 *
 * @description
 * Negate a value like the [logical NOT (`!`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_NOT) operator.
 *
 * ```javascript [playground]
 * const myObj = { a: 1 }
 *
 * console.log(not('a' in myObj)) // false
 * console.log(not('b' in myObj)) // true
 * ```
 *
 * If provided a predicate function, `not` returns a logically inverted predicate that returns true everywhere the original predicate would have returned false.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * console.log(
 *   not(isOdd)(3),
 * ) // false
 * ```
 */

const not = function (...args) {
  const predicateOrValue = args.pop()
  if (typeof predicateOrValue == 'function') {
    if (args.length == 0) {
      return curryArgs2(_not, __, predicateOrValue)
    }
    if (areAnyValuesPromises(args)) {
      return promiseAll(args).then(curry2(_not, __, predicateOrValue))
    }
    return _not(args, predicateOrValue)
  }
  return !predicateOrValue
}

module.exports = not
