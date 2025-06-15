const __ = require('./placeholder')
const isPromise = require('./isPromise')
const curry2 = require('./curry2')
const thunkify3 = require('./thunkify3')
const setAdd = require('./setAdd')
const funcConcat = require('./funcConcat')
const symbolIterator = require('./symbolIterator')

// _setMapSeriesAsync(
//   iterator Iterator,
//   f function,
//   result Set,
// ) -> Promise<Set>
const _setMapSeriesAsync = async function (iterator, f, result) {
  let iteration = iterator.next()
  while (!iteration.done) {
    let resultElement = f(iteration.value)
    if (isPromise(resultElement)) {
      resultElement = await resultElement
    }
    result.add(resultElement)
    iteration = iterator.next()
  }
  return result
}

/**
 * @name setMapSeries
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type SetMapper = (
 *   value any,
 *   key any,
 *   collection Set
 * )=>(resultElement Promise|any)
 *
 * setMapSeries(set Set, f SetMapper) -> Promise|Set
 * ```
 *
 * @description
 * Apply a mapper in series to each value of a set, returning a new set of mapped elements. Mapper may be asynchronous.
 */
const setMapSeries = function (set, f) {
  const result = new Set()
  const iterator = set[symbolIterator]()
  let iteration = iterator.next()
  while (!iteration.done) {
    const resultElement = f(iteration.value)
    if (isPromise(resultElement)) {
      return resultElement.then(funcConcat(
        curry2(setAdd, result, __),
        thunkify3(_setMapSeriesAsync, iterator, f, result),
      ))
    }
    result.add(resultElement)
    iteration = iterator.next()
  }
  return result
}

module.exports = setMapSeries
