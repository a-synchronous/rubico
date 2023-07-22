export = mapReduce;
/**
 * @name mapReduce
 *
 * @synopsis
 * ```coffeescript [specscript]
 * mapReduce(
 *   map Map,
 *   reducer (result any, value any, key string, map)=>Promise|any,
 *   result any,
 * ) -> Promise|result
 * ```
 */
declare function mapReduce(map: any, reducer: any, result: any): any;
