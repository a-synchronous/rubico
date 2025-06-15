const isPromise = require('./isPromise')
const promiseRace = require('./promiseRace')
const promiseAll = require('./promiseAll')
const symbolIterator = require('./symbolIterator')

/**
 * @name _mapMapPoolAsync
 *
 * @synopsis
 * ```coffeescript [specscript]
 * _mapMapPoolAsync(
 *   m Map,
 *   iterator Iterator,
 *   concurrency number,
 *   f function,
 *   result Map,
 *   promises Set,
 * ) -> Promise<Map>
 * ```
 */
const _mapMapPoolAsync = async function (
  m, iterator, concurrency, f, result, promises,
) {
  let iteration = iterator.next()
  while (!iteration.done) {
    if (promises.size >= concurrency) {
      await promiseRace(promises)
    }
    const key = iteration.value[0]
    const resultElement = f(iteration.value[1], key, m)
    if (isPromise(resultElement)) {
      result.set(key, resultElement)
      const selfDeletingPromise = resultElement.then(resolvedValue => {
        promises.delete(selfDeletingPromise)
        result.set(key, resolvedValue)
      })
      promises.add(selfDeletingPromise)
    } else {
      result.set(key, resultElement)
    }
    iteration = iterator.next()
  }
  if (promises.size > 0) {
    await promiseAll(promises)
  }
  return result
}

/**
 * @name mapMapPool
 *
 * @synopsis
 * ```coffeescript [specscript]
 * mapMapPool(m Map, concurrency number, f function) -> Promise|Map
 * ```
 */
const mapMapPool = function (m, concurrency, f) {
  const result = new Map()
  const iterator = m[symbolIterator]()
  let iteration = iterator.next()
  while (!iteration.done) {
    const key = iteration.value[0]
    const resultElement = f(iteration.value[1], key, m)
    if (isPromise(resultElement)) {
      const promises = new Set()
      result.set(key, resultElement)
      const selfDeletingPromise = resultElement.then(resolvedValue => {
        promises.delete(selfDeletingPromise)
        result.set(key, resolvedValue)
      })
      promises.add(selfDeletingPromise)
      return _mapMapPoolAsync(m, iterator, concurrency, f, result, promises)
    }
    result.set(key, resultElement)
    iteration = iterator.next()
  }
  return result
}

module.exports = mapMapPool
