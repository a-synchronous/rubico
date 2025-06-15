const __ = require('./placeholder')
const isPromise = require('./isPromise')
const curry3 = require('./curry3')
const thunkify3 = require('./thunkify3')
const mapSet = require('./mapSet')
const funcConcat = require('./funcConcat')
const symbolIterator = require('./symbolIterator')

// _mapMapSeriesAsync(
//   iterator Iterator,
//   f function,
//   result Map,
// ) -> Promise<Map>
const _mapMapSeriesAsync = async function (iterator, f, result) {
  let iteration = iterator.next()
  while (!iteration.done) {
    let resultElement = f(iteration.value[1])
    if (isPromise(resultElement)) {
      resultElement = await resultElement
    }
    result.set(iteration.value[0], resultElement)
    iteration = iterator.next()
  }
  return result
}

/**
 * @name mapMapSeries
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type MapMapper = (
 *   value any,
 *   key any,
 *   map Map
 * )=>(resultElement Promise|any)
 *
 * mapMapSeries(map Map, f MapMapper) -> Promise|Map
 * ```
 *
 * @description
 * Apply a mapper in series to each value of a Map, returning a new Map of mapped elements. Mapper may be asynchronous.
 */
const mapMapSeries = function (map, f) {
  const result = new Map()
  const iterator = map[symbolIterator]()
  let iteration = iterator.next()
  while (!iteration.done) {
    const key = iteration.value[0]
    const resultElement = f(iteration.value[1])
    if (isPromise(resultElement)) {
      return resultElement.then(funcConcat(
        curry3(mapSet, result, key, __),
        thunkify3(_mapMapSeriesAsync, iterator, f, result),
      ))
    }
    result.set(key, resultElement)
    iteration = iterator.next()
  }
  return result
}

module.exports = mapMapSeries
