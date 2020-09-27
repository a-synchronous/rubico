const isPromise = require('./isPromise')
const promiseAll = require('./promiseAll')
const always = require('./always')
const __ = require('./placeholder')
const curry2 = require('./curry2')

/**
 * @name setMap
 *
 * @synopsis
 * ```coffeescript [specscript]
 * setMap<
 *   T any,
 *   value Set<T>,
 *   mapper T=>Promise|any,
 * >(value, mapper) -> Promise|Set
 * ```
 *
 * @description
 * Apply a mapper concurrently to each item of a set, returning a set of results.
 */
const setMap = function (set, mapper) {
  const result = new Set(),
    promises = []
  for (const item of set) {
    const resultItem = mapper(item)
    if (isPromise(resultItem)) {
      promises.push(resultItem.then(curry2(setAdd, result, __)))
    } else {
      result.add(resultItem)
    }
  }
  return promises.length == 0
    ? result
    : promiseAll(promises).then(always(result))
}

module.exports = setMap
