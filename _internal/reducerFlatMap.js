const curryArgs3 = require('./curryArgs3')
const genericReduce = require('./genericReduce')
const __ = require('./placeholder')
const isPromise = require('./isPromise')

/**
 * @name reducerFlatMap
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
 * reducerFlatMap<T>(
 *   reducer (any, T)=>Promise|any,
 *   flatMapper T=>Promise|Monad<T>|Foldable<T>|T,
 * ) -> flatMappingReducer (any, T)=>Promise|any
 * ```
 */
const reducerFlatMap = (
  reducer, flatMapper,
) => function flatMappingReducer(result, value) {
  const monad = flatMapper(value)
  return isPromise(monad)
    ? monad.then(curryArgs3(genericReduce, __, reducer, result))
    : genericReduce([monad], reducer, result)
}

module.exports = reducerFlatMap
