export = iteratorReduce;
/**
 * @name iteratorReduce
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var T any,
 *   iterator Iterator<T>,
 *   reducer (any, T)=>Promise|any,
 *   result any,
 *
 * iteratorReduce(iterator, reducer, result?) -> Promise|any
 * ```
 *
 * @description
 * Execute a reducer for each element of an iterator, returning a single value.
 */
declare function iteratorReduce(iterator: any, reducer: any, result: any): any;
