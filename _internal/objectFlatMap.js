const isPromise = require('./isPromise')
const objectMap = require('./objectMap')
const objectFlatten = require('./objectFlatten')

/**
 * @name objectFlatMap
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
 * objectFlatMap<
 *   T any,
 *   object Object<T>,
 *   flatMapper T=>Promise|Monad<T>|Foldable<T>|T,
 * >(object, flatMapper) -> Promise|Object<T>
 * ```
 *
 * @description
 * Apply a flatMapper to each value of an object, assigning all items of all results into a new object.
 *
 * @TODO "deeply copies" after objectFlatten changes to deep assignment
 */
const objectFlatMap = function (object, flatMapper) {
  const monadObject = objectMap(object, flatMapper)
  return isPromise(monadObject)
    ? monadObject.then(objectFlatten)
    : objectFlatten(monadObject)
}

module.exports = objectFlatMap
