const isPromise = require('./isPromise')
const promiseRace = require('./promiseRace')
const promiseAll = require('./promiseAll')

/**
 * @name _objectMapPoolAsync
 *
 * @synopsis
 * ```coffeescript [specscript]
 * _objectMapPoolAsync(
 *   o Object,
 *   concurrency number,
 *   f function,
 *   result Object,
 *   doneKeys Object,
 *   promises Set,
 * ) -> result Promise|Object
 * ```
 */
const _objectMapPoolAsync = async function (
  o, concurrency, f, result, doneKeys, promises,
) {
  for (const key in o) {
    if (key in doneKeys) {
      continue
    }
    if (promises.size >= concurrency) {
      await promiseRace(promises)
    }
    const resultElement = f(o[key], key, o)
    if (isPromise(resultElement)) {
      result[key] = resultElement
      const selfDeletingPromise = resultElement.then(resolvedValue => {
        promises.delete(selfDeletingPromise)
        result[key] = resolvedValue
      })
      promises.add(selfDeletingPromise)
    } else {
      result[key] = resultElement
    }
  }
  if (promises.size > 0) {
    await promiseAll(promises)
  }
  return result
}

/**
 * @name objectMapPool
 *
 * @synopsis
 * ```coffeescript [specscript]
 * objectMapPool(o Object, concurrency number, f function) -> Promise|Object
 * ```
 */
const objectMapPool = function (o, concurrency, f) {
  const result = {}
  const doneKeys = {}
  for (const key in o) {
    doneKeys[key] = true
    const resultElement = f(o[key], key, o)
    if (isPromise(resultElement)) {
      const promises = new Set()
      result[key] = resultElement
      const selfDeletingPromise = resultElement.then(resolvedValue => {
        promises.delete(selfDeletingPromise)
        result[key] = resolvedValue
      })
      promises.add(selfDeletingPromise)
      return _objectMapPoolAsync(o, concurrency, f, result, doneKeys, promises)
    }
    result[key] = resultElement
  }
  return result
}

module.exports = objectMapPool
