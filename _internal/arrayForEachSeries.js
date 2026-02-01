const isPromise = require('./isPromise')
const thunkify3 = require('./thunkify3')

// _arrayForEachSeriesAsync(
//   array Array,
//   callback function,
//   index number
// ) -> Promise<array>
const _arrayForEachSeriesAsync = async function (array, callback, index) {
  const length = array.length
  while (++index < length) {
    const operation = callback(array[index])
    if (isPromise(operation)) {
      await operation
    }
  }
  return array
}

/**
 * @name arrayForEachSeries
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var T any,
 *   array Array<T>,
 *   callback T=>()
 *
 * arrayForEachSeries(array Array, callback function) -> array|Promise
 * ```
 *
 * @description
 * Call a callback for each element of an array in series. Return a promise if any executions are asynchronous.
 */
const arrayForEachSeries = function (array, callback) {
  const length = array.length
  let index = -1
  while (++index < length) {
    const operation = callback(array[index], index, array)
    if (isPromise(operation)) {
      return operation
        .then(thunkify3(_arrayForEachSeriesAsync, array, callback, index))
    }
  }
  return array
}

module.exports = arrayForEachSeries
