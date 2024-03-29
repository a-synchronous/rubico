export = setFlatMap;
/**
 * @name setFlatMap
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
 * setFlatMap<
 *   T any,
 *   set Set<T>,
 *   flatMapper T=>Promise|Monad<T>|Foldable<T>|T,
 * >(set, flatMapper) -> Promise|Set<T>
 * ```
 */
declare function setFlatMap(set: any, flatMapper: any): any;
