export = setMap;
/**
 * @name setMap
 *
 * @synopsis
 * ```coffeescript [specscript]
 * setMap<
 *   T any,
 *   value Set<T>,
 *   mapper T=>Promise|any,
 * >(value, mapper) -> Promise|Set
 * ```
 *
 * @description
 * Apply a mapper concurrently to each element of a set, returning a set of results.
 */
declare function setMap(set: any, mapper: any): any;
