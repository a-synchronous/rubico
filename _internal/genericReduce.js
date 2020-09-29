const isArray = require('./isArray')
const objectValues = require('./objectValues')
const isGeneratorFunction = require('./isGeneratorFunction')
const isAsyncGeneratorFunction = require('./isAsyncGeneratorFunction')
const iteratorReduce = require('./iteratorReduce')
const asyncIteratorReduce = require('./asyncIteratorReduce')
const symbolIterator = require('./symbolIterator')
const symbolAsyncIterator = require('./symbolAsyncIterator')
const __ = require('./placeholder')
const curry2 = require('./curry2')
const curryArgs3 = require('./curryArgs3')
const arrayReduce = require('./arrayReduce')
const generatorFunctionReduce = require('./generatorFunctionReduce')
const asyncGeneratorFunctionReduce = require('./asyncGeneratorFunctionReduce')
const reducerConcat = require('./reducerConcat')

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
    const combinedReducer = args.length == 0
      ? reducer
      : args.reduce(reducerConcat, reducer)
    return curryArgs3(genericReduce, __, combinedReducer, result)
    /*
    return tacitGenericReduce(
      args.length == 0 ? reducer : args.reduce(reducerConcat, reducer),
      result)
      */
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

module.exports = genericReduce
