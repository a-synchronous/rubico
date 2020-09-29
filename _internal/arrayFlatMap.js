const isPromise = require('./isPromise')
const arrayFlatten = require('./arrayFlatten')
const arrayMap = require('./arrayMap')

/**
 * @name arrayFlatMap
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
 * arrayFlatMap<T>(
 *   array Array<T>,
 *   flatMapper T=>Promise|Monad<T>|Foldable<T>|T,
 * ) -> Promise|Array<T>
 * ```
 */
const arrayFlatMap = function (array, flatMapper) {
  const monadArray = arrayMap(array, flatMapper)
  return isPromise(monadArray)
    ? monadArray.then(arrayFlatten)
    : arrayFlatten(monadArray)
}

module.exports = arrayFlatMap
