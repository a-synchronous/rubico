const isPromise = require('./isPromise')
const __ = require('./placeholder')
const curry5 = require('./curry5')
const objectKeys = require('./objectKeys')
const objectGetFirstKey = require('./objectGetFirstKey')

/**
 * @name objectReduceAsync
 *
 * @synopsis
 * ```coffeescript [specscript]
 * objectReduceAsync(
 *   object Object,
 *   reducer (any, item any, key string, object)=>Promise|any,
 *   result any,
 * ) -> Promise<result>
 * ```
 */
const objectReduceAsync = async function (object, reducer, result, keys, index) {
  const keysLength = keys.length
  while (++index < keysLength) {
    const key = keys[index]
    result = reducer(result, object[key], key, object)
    if (isPromise(result)) {
      result = await result
    }
  }
  return result
}

/**
 * @name objectReduce
 *
 * @synopsis
 * ```coffeescript [specscript]
 * objectReduce(
 *   object Object,
 *   reducer (any, item any, key string, object)=>Promise|any,
 *   result any,
 * ) -> Promise|result
 * ```
 */
const objectReduce = function (object, reducer, result) {
  const keys = objectKeys(object),
    keysLength = keys.length
  let index = -1
  if (result === undefined) {
    result = object[keys[++index]]
  }
  while (++index < keysLength) {
    const key = keys[index]
    result = reducer(result, object[key], key, object)
    if (isPromise(result)) {
      return result.then(curry5(objectReduceAsync, object, reducer, __, keys, index))
    }
  }
  return result
}

module.exports = objectReduce
