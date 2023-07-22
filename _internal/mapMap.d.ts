export = mapMap;
/**
 * @name mapMap
 *
 * @synopsis
 * ```coffeescript [specscript]
 * mapMap(
 *   value Map,
 *   mapper (item any, key any, value)=>Promise|any
 * ) -> Promise|Map<any=>any>
 * ```
 *
 * @description
 * Apply a mapper concurrently to each value (not entry) of a Map, returning a Map of results. `mapper` may be asynchronous.
 */
declare function mapMap(value: any, mapper: any): any;
