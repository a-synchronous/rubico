const isPromise = require('./isPromise')
const thunkConditional = require('./thunkConditional')
const __ = require('./placeholder')
const curry4 = require('./curry4')
const noop = require('./noop')
const always = require('./always')

/**
 * @name mapFilter
 *
 * @synopsis
 * ```coffeescript [specscript]
 * mapFilter<
 *   T any,
 *   map Map<any=>T>,
 *   predicate T=>Promise|boolean,
 * >(map, predicate) -> filteredValuesByPredicate Map<any=>T>
 * ```
 *
 * @description
 * Filter the values of a Map concurrently by predicate. `predicate` may be asynchronous.
 *
 * Note: for asynchronous predicates, the order of the resulting Map is not guaranteed
 *
 * @TODO mapFilterSeries (will guarantee order for asynchronous predicates)
 */
const mapFilter = function (map, predicate) {
  const result = new Map(),
    promises = []
  for (const [key, item] of map) {
    const predication = predicate(item)
    if (isPromise(predication)) {
      promises.push(predication.then(thunkConditional(
        __,
        curry4(callPropBinary, result, 'set', key, __),
        noop)))
    } else if (predication) {
      result.set(key, item)
    }
  }
  return promises.length == 0 ? result : promises.then(always(result))
}

module.exports = mapFilter
