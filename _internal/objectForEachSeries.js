const isPromise = require('./isPromise')
const thunkify3 = require('./thunkify3')

// _objectForEachSeriesAsync(
//   object Object,
//   callback function,
//   doneKeys Object,
// ) -> Promise<object>
const _objectForEachSeriesAsync = async function (object, callback, doneKeys) {
  for (const key in object) {
    if (key in doneKeys) {
      continue
    }
    const operation = callback(object[key])
    if (isPromise(operation)) {
      await operation
    }
  }
  return object
}

/**
 * @name objectForEachSeries
 *
 * @synopsis
 * ```coffeescript [specscript]
 * objectForEachSeries(object Object, callback function) -> Promise|object
 * ```
 *
 * @description
 * Execute a callback for each value of an object. Return a promise if any executions are asynchronous.
 */
const objectForEachSeries = function (object, callback) {
  const doneKeys = {}
  for (const key in object) {
    doneKeys[key] = true
    const operation = callback(object[key], key, object)
    if (isPromise(operation)) {
      return operation
        .then(thunkify3(_objectForEachSeriesAsync, object, callback, doneKeys))
    }
  }
  return object
}

module.exports = objectForEachSeries
