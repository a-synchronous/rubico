const isPromise = require('../_internal/isPromise')
const always = require('../_internal/always')
const __ = require('../_internal/placeholder')
const thunkify1 = require('../_internal/thunkify1')
const curry3 = require('../_internal/curry3')
const thunkConditional = require('../_internal/thunkConditional')

/**
 * @name unless
 *
 * @synopsis
 * ```coffeescript [specscript]
 * unless(
 *   predicate any=>Promise|boolean,
 *   func function,
 * )(value any) -> Promise|any
 * ```
 *
 * @description
 * Execute a function and return the result unless a condition is true, otherwise return the original value.
 *
 * ```javascript [playground]
 * import unless from 'https://unpkg.com/rubico/dist/x/unless.es.js'
 *
 * const isEven = num => num % 2 === 0
 * const doubleIfOdd = unless(isEven, num => num * 2)
 *
 * console.log(doubleIfOdd(100)) // 100
 * console.log(doubleIfOdd(101)) // 202
 * ```
 *
 * @since 1.7.3
 */

const unless = (predicate, func) => function unlessFunc(value) {
  const predication = predicate(value)
  if (isPromise(predication)) {
    return predication.then(
      curry3(thunkConditional, __, always(value), thunkify1(func, value))
    )
  }
  if (!predication) {
    return func(value)
  }
  return value
}

module.exports = unless
