export = objectMap;
/**
 * @name objectMap
 *
 * @synopsis
 * ```coffeescript [specscript]
 * objectMap<
 *   T any,
 *   object Object<T>,
 *   mapper T=>Promise|any,
 * >(object, mapper) -> Promise|Object
 * ```
 *
 * @description
 * Apply a mapper concurrently to each value of an object, returning an object of results. Mapper may be asynchronous.
 */
declare function objectMap(object: any, mapper: any): any;
