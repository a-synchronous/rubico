export = asyncIteratorReduce;
/**
 * @name asyncIteratorReduce
 *
 * @synopsis
 * ```coffeescript [specscript]
 * asyncIteratorReduce(
 *   asyncIterator AsyncIterator<T>,
 *   reducer (any, T)=>Promise|any,
 *   result any,
 * ) -> result any
 * ```
 */
declare function asyncIteratorReduce(asyncIterator: any, reducer: any, result: any): Promise<any>;
