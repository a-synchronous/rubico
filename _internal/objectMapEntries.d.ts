export = objectMapEntries;
/**
 * @name objectMapEntries
 *
 * @synopsis
 * ```coffeescript [specscript]
 * objectMapEntries(
 *   object Object,
 *   mapper ([key string, value any])=>Promise|[string, any],
 * ) -> Promise|Object
 * ```
 */
declare function objectMapEntries(object: any, mapper: any): any;
