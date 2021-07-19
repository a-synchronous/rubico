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
 * )(object Object) -> Promise|any
 * ```
 *
 * @description
 * Execute a function and return the result when a condition is true, otherwise return the original object.
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
 */

const when = (predicate, func) => function whenFunc(object) {
  const predication = predicate(object)
  if (isPromise(predication)) {
    return predication.then(curry3(
      thunkConditional,
      __,
      thunkify1(func, object),
      always(object),
    ))
  }
  if (predication) {
    return func(object)
  }
  return object
}

module.exports = when
