export = objectFlatten;
/**
 * @name objectFlatten
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
 * objectFlatten<T>(
 *   object Object<Monad<T>|Foldable<T>|T>,
 * ) -> Object<T>
 * ```
 *
 * @TODO change objectAssign to objectDeepAssign
 */
declare function objectFlatten(object: any): any;
