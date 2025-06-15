const __ = require('./placeholder')
const isPromise = require('./isPromise')
const curry3 = require('./curry3')
const thunkify4 = require('./thunkify4')
const objectSet = require('./objectSet')
const funcConcat = require('./funcConcat')
const symbolIterator = require('./symbolIterator')

// _objectMapSeriesAsync(
//   object Object,
//   f function,
//   result Object,
//   doneKeys Object
// ) -> Promise<object>
const _objectMapSeriesAsync = async function (object, f, result, doneKeys) {
  for (const key in object) {
    if (key in doneKeys) {
      continue
    }
    let resultElement = f(object[key])
    if (isPromise(resultElement)) {
      resultElement = await resultElement
    }
    result[key] = resultElement
  }
  return result
}

/**
 * @name objectMapSeries
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type ObjectMapper = (
 *   value any,
 *   key string,
 *   collection Object
 * )=>(resultElement Promise|any)
 *
 * objectMapSeries(object Object, f ObjectMapper) -> Promise|Object
 * ```
 *
 * @description
 * Apply a function `f` in series to each value of an object, returning an object of results. `f` may be asynchronous.
 */
const objectMapSeries = function (object, f) {
  const result = {}
  const doneKeys = {}
  for (const key in object) {
    doneKeys[key] = true
    const resultElement = f(object[key], key, object)
    if (isPromise(resultElement)) {
      return resultElement.then(funcConcat(
        curry3(objectSet, result, key, __),
        thunkify4(_objectMapSeriesAsync, object, f, result, doneKeys),
      ))
    }
    result[key] = resultElement
  }
  return result
}

module.exports = objectMapSeries
