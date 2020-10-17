/**
 * @name callChain
 *
 * @synopsis
 * Monad = { chain: function }
 *
 * callChain(monad Monad, resolver)
const callChain = (monad, resolver) => monad.chain(resolver)
 */

/**
 * @name arrayPushIf
 *
 * @synopsis
 * arrayPushIf(predicate, any=>boolean, array Array, item any) -> ()
 */
const arrayPushIf = function (predicate, array, item) {
  if (predicate(item)) {
    array.push(item)
  }
}

/**
 * @name forEachReduceConcurrent
 *
 * @synopsis
 * forEachReduceConcurrent(
 *   collection { forEach: function },
 *   reducer (any, T)=>Promise|any,
 *   result any,
 * ) -> Promise|result
 */
const forEachReduceConcurrent = function (collection, reducer, result) {
  const promises = [],
    getResult = () => result
  collection.forEach(funcConcatSync(
    curry2(reducer, result, __),
    curry3(arrayPushIf, isPromise, promises, __)))

  /*
  collection.forEach([
    tap(item => console.log('heyo', reducer, result, item)),
    curry2(reducer, result, __),
    curry3(arrayPushIf, isPromise, promises, __),
  ].reduce(funcConcatSync))
  */

  return promises.length == 0
    ? result
    : promiseAll(promises).then(getResult)
}

/**
 * @name iterableReduceConcurrent
 *
 * @synopsis
 * iterableReduceConcurrent(
 *   iterable { [Symbol.iterator]: function },
 *   reducer (any, T)=>Promise|any,
 *   result any,
 * ) -> Promise|result
 */
const iterableReduceConcurrent = function (iterable, reducer, result) {
  const promises = [],
    getResult = () => result,
    pipeline = funcConcatSync(
      curry2(reducer, result, __),
      curry3(arrayPushIf, isPromise, promises, __))

  for (const item of iterable) {
    pipeline(item)
  }
  return promises.length == 0
    ? result
    : promiseAll(promises).then(getResult)
}

/**
 * @name asyncIterableReduceConcurrent
 *
 * @synopsis
 * asyncIterableReduceConcurrent(
 *   asyncIterable { [Symbol.iterator]: function },
 *   reducer (any, T)=>Promise|any,
 *   result any,
 * ) -> Promise|result
 */
const asyncIterableReduceConcurrent = async function (asyncIterable, reducer, result) {
  const promises = [],
    getResult = () => result,
    pipeline = funcConcatSync(
      curry2(reducer, result, __),
      curry3(arrayPushIf, isPromise, promises, __))

  for await (const item of asyncIterable) {
    pipeline(item)
  }
  return promises.length == 0
    ? result
    : promiseAll(promises).then(getResult)
}

/**
 * @name objectReduceConcurrent
 *
 * @synopsis
 * objectReduceConcurrent(
 *   object Object,
 *   reducer (any, T)=>Promise|any,
 *   result any,
 * ) -> Promise|result
 *
 * @related objectFlatMap
 */
const objectReduceConcurrent = function (object, reducer, result) {
  const promises = [],
    getResult = () => result,
    pipeline = funcConcatSync(
      curry2(reducer, result, __),
      curry3(arrayPushIf, isPromise, promises, __))

  for (const key in object) {
    pipeline(object[key])
  }
  return promises.length == 0
    ? result
    : promiseAll(promises).then(getResult)
}

/**
 * @name getArg1
 *
 * @synopsis
 * getArg1(arg0 any, arg1 any) -> arg1
 */
const getArg1 = function (arg0, arg1) {
  return arg1
}

/**
 * @name foldableReduceConcurrent
 *
 * @synopsis
 * foldableReduceConcurrent(
 *   foldable { reduce: function },
 *   reducer (any, T)=>Promise|any,
 *   result any,
 * ) -> Promise|result
 */
const foldableReduceConcurrent = function (foldable, reducer, result) {
  const promises = [],
    getResult = () => result,
    pipeline = [
      getArg1,
      curry2(reducer, result, __),
      curry3(arrayPushIf, isPromise, promises, __),
    ].reduce(funcConcatSync)

  foldable.reduce(tapSync(pipeline), null)
  return promises.length == 0
    ? result
    : promiseAll(promises).then(getResult)
}

/**
 * @name tacitGenericReduceConcurrent
 *
 * @synopsis
 * any -> T
 *
 * tacitGenericReduceConcurrent(
 *   reducer (any, T)=>any,
 *   result any,
 * ) -> reducing ...any=>result
 */
const tacitGenericReduceConcurrent = (
  reducer, result,
) => function reducing(...args) {
  return genericReduceConcurrent(args, reducer, result)
}

/**
 * @name genericReduceConcurrent
 *
 * @synopsis
 * genericReduceConcurrent(
 *   args Array,
 *   reducer function,
 *   result any,
 * ) -> result
 *
 * @related
 * genericReduce
 *
 * @NOTE
 * concurrency is only possible because result is never reassigned. in that regard, `result` is required.
 */
const genericReduceConcurrent = function (args, reducer, result) {
  const collection = args[0]
  if (collection == null) {
    reducer(result, collection)
    return result
  }
  if (typeof collection.forEach == 'function') {
    return forEachReduceConcurrent(collection, reducer, result)
  }
  if (typeof collection[symbolIterator] == 'function') {
    return iterableReduceConcurrent(collection, reducer, result)
  }
  if (typeof collection[symbolAsyncIterator] == 'function') {
    return asyncIterableReduceConcurrent(collection, reducer, result)
  }
  if (typeof collection.reduce == 'function') {
    return foldableReduceConcurrent(collection, reducer, result)
  }
  if (typeof collection.chain == 'function') {
    return collection.chain(curry2(reducer, result, __))
  }
  if (typeof collection.flatMap == 'function') {
    return collection.flatMap(curry2(reducer, result, __))
  }
  if (collection.constructor == Object) {
    return objectReduceConcurrent(collection, reducer, result)
  }
  reducer(result, collection)
  return result
}

/**
 * @name flatteningTransducerConcurrent
 *
 * @synopsis
 * flatteningTransducerConcurrent(concat Reducer) -> flatteningReducer Reducer
 *
 * DuplexStream = { read: function, write: function }
 *
 * Monad = Array|String|Set
 *   |TypedArray|DuplexStream|Iterator|AsyncIterator
 *   |{ chain: function }|{ flatMap: function }|Object
 *
 * Foldable = Iterable|AsyncIterable|{ reduce: function }
 *
 * FlatteningReducer<T> = (any, T)=>Promise|Monad|Foldable|any
 *
 * Reducer<T> = (any, T)=>Promise|any
 *
 * flatteningTransducerConcurrent(concat Reducer) -> flatteningReducer FlatteningReducer
 *
 * @execution concurrent
 */
const flatteningTransducerConcurrent = concat => function flatteningReducer(
  result, item,
) {
  return genericReduceConcurrent([item], concat, result)
}

/**
 * @name objectMapToArray
 *
 * @synopsis
 * objectMapToArray(
 *   object Object, mapper function,
 * ) -> Promise|Array
 *
 * @note order not guaranteed
 */
const objectMapToArray = function (object, mapper) {
  const result = []
  let isAsync = false

  for (const key in object) {
    const resultItem = mapper(object[key])
    if (isPromise(resultItem)) isAsync = true
    result.push(resultItem)
  }
  return isAsync ? promiseAll(result) : result
}
