const funcConcat = require('./funcConcat')
const isPromise = require('./isPromise')
const __ = require('./placeholder')
const curry3 = require('./curry3')
const curry5 = require('./curry5')
const objectSet = require('./objectSet')

/**
 * @name asyncFunctionObjectAllSeries
 *
 * @synopsis
 * ```coffeescript [specscript]
 * asyncFunctionObjectAllSeries(
 *   funcs Array<function>,
 *   args Array,
 *   result Array,
 *   keys Array<string>,
 *   keysIndex number
 * ) -> Promise|Array
 * ```
 *
 * @TODO benchmark vs regular promise handling
 */
const asyncFunctionObjectAllSeries = async function (funcs, args, result, keys, keysIndex) {
  const keysLength = keys.length
  while (++keysIndex < keysLength) {
    const key = keys[keysIndex]
    const f = funcs[key]
    let resultElement = typeof f == 'function' ? f(...args) : f
    if (isPromise(resultElement)) {
      resultElement = await resultElement
    }
    result[key] = resultElement
  }
  return result
}

/**
 * @name functionObjectAllSeries
 *
 * @synopsis
 * ```coffeescript [specscript]
 * functionObjectAllSeries(funcs Object<function|any>, args Array) -> Promise|Array
 * ```
 */
const functionObjectAllSeries = function (funcs, args) {
  const result = {}
  const keys = Object.keys(funcs)
  const keysLength = keys.length
  let keysIndex = -1
  while (++keysIndex < keysLength) {
    const key = keys[keysIndex]
    const f = funcs[key]
    const resultElement = typeof f == 'function' ? f(...args) : f
    if (isPromise(resultElement)) {
      return resultElement.then(funcConcat(
        curry3(objectSet, result, key, __),
        curry5(asyncFunctionObjectAllSeries, funcs, args, __, keys, keysIndex)))
    }
    result[key] = resultElement
  }
  return result
}

module.exports = functionObjectAllSeries
