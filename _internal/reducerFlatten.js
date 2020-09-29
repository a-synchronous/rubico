const genericReduce = require('./genericReduce')

/**
 * @name reducerFlatten
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
 * reducerFlatten<T>(
 *   reducer Reducer<Monad<T>|Foldable<T>|T>,
 * ) -> flatteningReducer Reducer<T>
 * ```
 *
 * @description
 * Create a flattening reducer - a reducer that flattens all items of a reducing operation into the result.
 *
 * @previously
 * flatteningTransducer
 */
const reducerFlatten = reducer => function flatteningReducer(
  result, reducerItem,
) {
  return genericReduce([reducerItem], reducer, result)
}

module.exports = reducerFlatten
