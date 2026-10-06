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
 * type Predicate = (...arguments)=>Promise|boolean
 *
 * not(value Promise|boolean|any) -> booleanResult Promise|boolean
 * not(...arguments, predicate Predicate) -> booleanResult Promise|boolean
 * not(predicate Predicate)(...arguments) -> booleanResult Promise|boolean
 * ```
 *
 * @description
 * Logical operator. Negates a predicate or value.
 *
 * ```javascript [playground]
 * const object = { a: 1 }
 *
 * console.log(not('a' in object))
 * console.log(not('b' in object))
 * ```
 *
 * If provided a predicate function, `not` returns a logically inverted predicate.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * const isNotOdd = not(isOdd)
 *
 * console.log(isNotOdd(3))
 * ```
 *
 * `not` negates the resolved value of a promise.
 *
 * ```javascript [playground]
 * const promise = Promise.resolve(false)
 *
 * not(promise).then(console.log)
 * ```
 *
 * Any promises in `arguments` are resolved for their values before further execution for the immediate interface only.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * not(Promise.resolve(3), isOdd).then(console.log) // false
 * ```
 *
 * See also:
 *  * [some](/docs/some)
 *  * [and](/docs/and)
 *  * [or](/docs/or)
 *  * [eq](/docs/eq)
 *
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
  return isPromise(predicateOrValue)
    ? predicateOrValue.then(negate)
    : !predicateOrValue
}

module.exports = not
