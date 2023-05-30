const funcCall = require('./funcCall')
const thunkify4 = require('./thunkify4')
const __ = require('./placeholder')
const curry2 = require('./curry2')
const curry3 = require('./curry3')
const curry4 = require('./curry4')
const isPromise = require('./isPromise')
const promiseAll = require('./promiseAll')
const _Promise = require('./_Promise')

/**
 * @name arrayMap
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayMap(
 *   array Array,
 *   mapper (item any, index number, array Array)=>Promise|any,
 * ) -> Promise|Array
 * ```
 *
 * @description
 * Apply a mapper to each item of an array, returning an array. Mapper may be asynchronous.
 */

const arrayMapHandlePromise = function (
  result, promise, index, promiseCounts, _promise
) {
  promiseCounts.pending += 1
  promise.then(value => {
    result[index] = value
    promiseCounts.resolved += 1
    if (promiseCounts.resolved == promiseCounts.pending) {
      _promise._fulfill(result)
    }
  }, error => {
    _promise.reject(error)
  })
}

const arrayMap2 = function (array, mapper) {
  const length = array.length
  const result = Array(length)
  const promiseCounts = { pending: 0, resolved: 0 }

  let index = -1
  let _promise = new _Promise()

  while (++index < length) {
    const ret = mapper(array[index], index, array)
    if (isPromise(ret)) {
      arrayMapHandlePromise(result, ret, index, promiseCounts, _promise)
    } else {
      result[index] = ret
    }
  }

  if (promiseCounts.pending == 0) {
    return result
  }

  return _promise
}

if (process.argv[1] == __filename) {
  const timeInLoopAsync = require('./timeInLoopAsync')

  timeInLoopAsync('arrayMap2', 1e6, async () => {
    await arrayMap2([1, 2, 3, 4, 5], async value => value + 1)
  })
}

module.exports = arrayMap2
