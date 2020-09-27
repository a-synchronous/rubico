const isGeneratorFunction = require('./isGeneratorFunction')
const isAsyncGeneratorFunction = require('./isAsyncGeneratorFunction')
const iteratorReduce = require('./iteratorReduce')

const symbolIterator = Symbol.iterator

const symbolAsyncIterator = Symbol.asyncIterator

const isArray = Array.isArray

/**
 * @name tacitGenericReduce
 *
 * @synopsis
 * ```coffeescript [specscript]
 * tacitGenericReduce(
 *   reducer (any, T)=>any,
 *   result any,
 * ) -> reducing ...any=>result
 * ```
 */
const tacitGenericReduce = (
  reducer, result,
) => function reducing(...args) {
  return genericReduce(args, reducer, result)
}

/**
 * @name genericReduce
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Foldable<T> = Iterable<T>|AsyncIterable<T>
 *   |{ reduce: (any, T)=>any }|Object<T>
 *
 * genericReduce<T>(
 *   args [collection Foldable<T>, ...any],
 *   reducer (any, T)=>any,
 *   result any?,
 * ) -> result
 * ```
 *
 * @related genericReduceConcurrent
 *
 * @TODO genericReduceSync(args, reducer, init) - performance optimization for some of these genericReduces that we know are synchronous
 *
 * @TODO genericReducePool(poolSize, args, reducer, init) - for some of these genericReduces that we want to race - result should not care about order of concatenations
 * reduce.pool
 * transform.pool
 * flatMap.pool
 */
var genericReduce = function (args, reducer, result) {
  const collection = args[0]
  if (isArray(collection)) {
    return arrayReduce(collection, reducer, result)
  }
  if (typeof collection == 'function') {
    if (isGeneratorFunction(collection)) {
      return generatorFunctionReduce(collection, reducer, result)
    }
    if (isAsyncGeneratorFunction(collection)) {
      return asyncGeneratorFunctionReduce(collection, reducer, result)
    }
    return tacitGenericReduce(
      args.length == 0 ? reducer : args.reduce(reducerConcat, reducer),
      result)
  }
  if (collection == null) {
    return result === undefined
      ? reducer(collection)
      : reducer(result, collection)
  }

  if (typeof collection.next == 'function') {
    return symbolIterator in collection
      ? iteratorReduce(collection, reducer, result)
      : asyncIteratorReduce(collection, reducer, result)
  }
  if (typeof collection[symbolIterator] == 'function') {
    return iteratorReduce(
      collection[symbolIterator](), reducer, result)
  }
  if (typeof collection[symbolAsyncIterator] == 'function') {
    return asyncIteratorReduce(
      collection[symbolAsyncIterator](), reducer, result)
  }
  if (typeof collection.reduce == 'function') {
    return collection.reduce(reducer, result)
  }
  if (typeof collection.chain == 'function') {
    return collection.chain(curry2(reducer, result, __))
  }
  if (typeof collection.flatMap == 'function') {
    return collection.flatMap(curry2(reducer, result, __))
  }
  if (collection.constructor == Object) {
    return arrayReduce(objectValues(collection), reducer, result)
  }
  return result === undefined
    ? reducer(collection)
    : reducer(result, collection)
}

/**
 * @name genericReduce.tacit
 *
 * @synopsis
 * ```coffeescript [specscript]
 * genericReduce.tacit(
 *   reducer (any, T)=>any,
 *   result any,
 * ) -> reducing ...any=>result
 * ```
 */
genericReduce.tacit = tacitGenericReduce

module.exports = genericReduce
