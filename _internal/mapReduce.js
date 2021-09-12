const isPromise = require('./isPromise')
const __ = require('./placeholder')
const curry4 = require('./curry4')

/**
 * @name mapReduceAsync
 *
 * @synopsis
 * ```coffeescript [specscript]
 * mapReduceAsync(
 *   map Map,
 *   reducer (result any, value any, key string, map)=>Promise|any,
 *   result any,
 *   mapEntriesIter Iterator<[key, value]>,
 * ) -> Promise<result>
 * ```
 */
const mapReduceAsync = async function (
  map, reducer, result, mapEntriesIter,
) {
  for (const [key, value] of mapEntriesIter) {
    result = reducer(result, value, key, map)
    if (isPromise(result)) {
      result = await result
    }
  }
  return result
}

/**
 * @name mapReduce
 *
 * @synopsis
 * ```coffeescript [specscript]
 * mapReduce(
 *   map Map,
 *   reducer (result any, value any, key string, map)=>Promise|any,
 *   result any,
 * ) -> Promise|result
 * ```
 */
const mapReduce = function (map, reducer, result) {
  const mapEntriesIter = map.entries()
  if (result === undefined) {
    const firstIteration = mapEntriesIter.next()
    if (firstIteration.done) {
      return result
    }
    result = firstIteration.value[1]
  }
  for (const [key, value] of mapEntriesIter) {
    result = reducer(result, value, key, map)
    if (isPromise(result)) {
      return result.then(curry4(
        mapReduceAsync, map, reducer, __, mapEntriesIter))
    }
  }
  return result
}

module.exports = mapReduce
