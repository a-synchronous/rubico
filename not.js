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
 * args Array<any>
 * argsOrPromises Array<Promise|any>
 *
 * type SyncOrAsyncPredicate = (...args)=>Promise|boolean
 *
 * predicate SyncOrAsyncPredicate
 *
 * not(value Promise|boolean|any) -> negated Promise|boolean
 * not(...argsOrPromises, predicate) -> negated Promise|boolean
 * not(predicate)(...args) -> negated Promise|boolean
 * ```
 *
 * @description
 * Function equivalent to the [Logical NOT (`!`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_NOT) operator. Negates a value.
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
 * const isNotOdd = not(isOdd)
 *
 * console.log(isNotOdd(3)) // false
 * ```
 *
 * `not` negates the resolved value of a promise.
 *
 * ```javascript [playground]
 * const promise = Promise.resolve(false)
 *
 * not(promise).then(console.log) // true
 * ```
 *
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
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
