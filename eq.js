const areAnyValuesPromises = require('./_internal/areAnyValuesPromises')
const isPromise = require('./_internal/isPromise')
const promiseAll = require('./_internal/promiseAll')
const __ = require('./_internal/placeholder')
const curry2 = require('./_internal/curry2')
const curryArgs3 = require('./_internal/curryArgs3')
const spread2 = require('./_internal/spread2')
const equals = require('./_internal/equals')
const always = require('./_internal/always')

// leftResolverRightResolverEq(args Array, left function, right function) -> Promise|boolean
const leftResolverRightResolverEq = function (args, left, right) {
  const leftResult = left(...args),
    rightResult = right(...args)
  if (isPromise(leftResult) || isPromise(rightResult)) {
    return promiseAll([leftResult, rightResult]).then(spread2(equals))
  }
  return equals(leftResult, rightResult)
}

// leftResolverRightValueEq(args Array, left function, right any) -> Promise|boolean
const leftResolverRightValueEq = function (args, left, right) {
  const leftResult = left(...args)
  if (isPromise(leftResult) || isPromise(right)) {
    return promiseAll([leftResult, right]).then(spread2(equals))
  }
  return equals(leftResult, right)
}

// leftValueRightResolverEq(args Array, left any, right any) -> Promise|boolean
const leftValueRightResolverEq = function (args, left, right) {
  const rightResult = right(...args)
  if (isPromise(left) || isPromise(rightResult)) {
    return promiseAll([left, rightResult]).then(spread2(equals))
  }
  return equals(left, rightResult)
}

/**
 * @name eq
 *
 * @synopsis
 * ```coffeescript [specscript]
 * eq(leftValue any, rightValue any) -> boolean
 *
 * eq(leftValue any, right function)(...args) -> Promise|boolean
 *
 * eq(left function, rightValue any)(...args) -> Promise|boolean
 *
 * eq(left function, right function)(...args) -> Promise|boolean
 *
 * eq(...args, left function, right function) -> Promise|boolean
 * ```
 *
 * @description
 * Test for [equality (`==`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Equality) between two values.
 *
 * ```javascript [playground]
 * const areNamesEqual = eq('Ted', 'George')
 *
 * console.log(areNamesEqual) // false
 * ```
 *
 * If either of the two values are resolver functions, `eq` returns a function that resolves the values to compare from its arguments.
 *
 * ```javascript [playground]
 * const personIsGeorge = eq(get('name'), 'George')
 *
 * const person = { name: 'George', likes: 'bananas' }
 *
 * if (personIsGeorge(person)) {
 *   console.log('The person is george')
 * }
 * ```
 *
 * @execution concurrent
 */

const eq = function (...args) {
  const right = args.pop()
  const left = args.pop()
  const isLeftResolver = typeof left == 'function',
    isRightResolver = typeof right == 'function'

  if (isLeftResolver && isRightResolver) {
    if (args.length == 0) {
      return curryArgs3(leftResolverRightResolverEq, __, left, right)
    }
    if (areAnyValuesPromises(args)) {
      return promiseAll(args)
        .then(curryArgs3(leftResolverRightResolverEq, __, left, right))
    }
    return leftResolverRightResolverEq(args, left, right)
  }

  if (isLeftResolver) {
    return curryArgs3(leftResolverRightValueEq, __, left, right)
  }

  if (isRightResolver) {
    return curryArgs3(leftValueRightResolverEq, __, left, right)
  }

  return equals(left, right)
}

module.exports = eq
