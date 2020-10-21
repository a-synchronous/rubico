const isPromise = require('./isPromise')
const promiseAll = require('./promiseAll')
const __ = require('./placeholder')
const curry4 = require('./curry4')
const always = require('./always')
const callPropBinary = require('./callPropBinary')

/**
 * @name mapMap
 *
 * @synopsis
 * ```coffeescript [specscript]
 * mapMap<
 *   T any,
 *   value Map<any=>T>,
 *   mapper T=>Promise|any,
 * >(value, mapper) -> Promise|Map<any=>any>
 * ```
 *
 * @description
 * Apply a mapper concurrently to each value (not entry) of a Map, returning a Map of results. `mapper` may be asynchronous.
 */
const mapMap = function (value, mapper) {
  const result = new Map(),
    promises = []
  for (const [key, item] of value) {
    const resultItem = mapper(item)
    if (isPromise(resultItem)) {
      promises.push(resultItem.then(
        curry4(callPropBinary, result, 'set', key, __)))
    } else {
      result.set(key, resultItem)
    }
  }
  return promises.length == 0
    ? result
    : promiseAll(promises).then(always(result))
}

module.exports = mapMap
