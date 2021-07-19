const isPromise = require('../_internal/isPromise')
const always = require('../_internal/always')
const __ = require('../_internal/placeholder')
const thunkify1 = require('../_internal/thunkify1')
const curry3 = require('../_internal/curry3')
const thunkConditional = require('../_internal/thunkConditional')

/**
 * @name when
 *
 * @synopsis
 * ```coffeescript [specscript]
 * when(
 *   predicate any=>Promise|boolean,
 *   func function,
 * )(value any) -> Promise|any
 * ```
 *
 * @description
 * Execute a function and return the result when a condition is true, otherwise return the original value.
 *
 * ```javascript [playground]
 * import when from 'https://unpkg.com/rubico/dist/x/when.es.js'
 *
 * const isEven = num => num % 2 === 0
 * const doubleIfEven = when(isEven, num => num * 2)
 *
 * console.log(doubleIfEven(100)) // 200
 * console.log(doubleIfEven(101)) // 101
 * ```
 *
 * @since 1.7.1
 */

const when = (predicate, func) => function whenFunc(value) {
  const predication = predicate(value)
  if (isPromise(predication)) {
    return predication.then(curry3(
      thunkConditional,
      __,
      thunkify1(func, value),
      always(value),
    ))
  }
  if (predication) {
    return func(value)
  }
  return value
}

module.exports = when
