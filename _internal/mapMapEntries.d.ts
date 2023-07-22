export = mapMapEntries;
/**
 * @name mapMapEntries
 *
 * @synopsis
 * ```coffeescript [specscript]
 * mapMapEntries(
 *   source Map,
 *   mapper ([key string, source any])=>Promise|[string, any],
 * ) -> Promise|Map
 * ```
 */
declare function mapMapEntries(source: any, mapper: any): any;
