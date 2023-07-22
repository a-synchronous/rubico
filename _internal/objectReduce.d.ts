export = objectReduce;
/**
 * @name objectReduce
 *
 * @synopsis
 * ```coffeescript [specscript]
 * objectReduce(
 *   object Object,
 *   reducer (any, item any, key string, object)=>Promise|any,
 *   result any,
 * ) -> Promise|result
 * ```
 */
declare function objectReduce(object: any, reducer: any, result: any): any;
