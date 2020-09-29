const binaryExtend = require('./binaryExtend')
const arrayFlatten = require('./arrayFlatten')
const arrayMap = require('./arrayMap')
const __ = require('./placeholder')
const curry2 = require('./curry2')
const bufferAlloc = require('./bufferAlloc')
const isPromise = require('./isPromise')
const globalThisHasBuffer = require('./globalThisHasBuffer')

/**
 * @name arrayJoinToBinary
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayJoinToBinary<
 *   array Array<TypedArray|Buffer>,
 *   init TypedArray|Buffer,
 * >(array, init) -> TypedArray|Buffer
 * ```
 */
const arrayJoinToBinary = function (array, init) {
  const length = array.length
  let index = -1,
    result = init
  while (++index < length) {
    result = binaryExtend(result, array[index])
  }
  return result
}

/**
 * @name arrayFlattenToBinary
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Stream<T> = { read: ()=>T, write: T=>() }
 * Monad<T> = Array<T>|String<T>|Set<T>
 *   |TypedArray<T>|Stream<T>|Iterator<Promise|T>
 *   |{ chain: T=>Monad<T> }|{ flatMap: T=>Monad<T> }|Object<T>
 * Reducer<T> = (any, T)=>Promise|any
 * Foldable<T> = Iterable<T>|AsyncIterable<T>|{ reduce: Reducer<T> }|Object<T>
 *
 * arrayFlattenToBinary<T>(
 *   array Array<Monad<T>|Foldable<T>|T>
 *   result TypedArray<T>|Buffer<T>,
 * ) -> TypedArray<T>|Buffer<T>
 * ```
 */
const arrayFlattenToBinary = function (array, result) {
  const flattened = arrayFlatten(array)
  return isPromise(flattened)
    ? flattened.then(curry2(arrayJoinToBinary, __, result))
    : arrayJoinToBinary(flattened, result)
}

/**
 * @name binaryFlatMap
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Stream<T> = { read: ()=>T, write: T=>() }
 * Monad<T> = Array<T>|String<T>|Set<T>
 *   |TypedArray<T>|Stream<T>|Iterator<Promise|T>
 *   |{ chain: T=>Monad<T> }|{ flatMap: T=>Monad<T> }|Object<T>
 * Reducer<T> = (any, T)=>Promise|any
 * Foldable<T> = Iterable<T>|AsyncIterable<T>|{ reduce: Reducer<T> }|Object<T>
 *
 * binaryFlatMap<T>(
 *   binary TypedArray<T>|Buffer<T>,
 *   flatMapper T=>Promise|Monad<T>|Foldable<T>|T,
 * ) -> TypedArray<T>|Buffer<T>
 * ```
 */
const binaryFlatMap = function (binary, flatMapper) {
  const monadArray = arrayMap(binary, flatMapper),
    result = globalThisHasBuffer && binary.constructor == Buffer
      ? bufferAlloc(0)
      : new binary.constructor(0)
  return isPromise(monadArray)
    ? monadArray.then(curry2(arrayFlattenToBinary, __, result))
    : arrayFlattenToBinary(monadArray, result)
}

module.exports = binaryFlatMap
