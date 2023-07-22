export = arrayReduce;
/**
 * @name arrayReduce
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayReduce<T>(
 *   array Array<T>,
 *   reducer (any, T)=>Promise|any,
 *   result any,
 * ) -> Promise|result
 * ```
 */
declare function arrayReduce(array: any, reducer: any, result: any): any;
