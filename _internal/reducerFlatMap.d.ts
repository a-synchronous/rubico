export = reducerFlatMap;
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
declare function reducerFlatMap(reducer: any, flatMapper: any): (result: any, value: any) => any;
