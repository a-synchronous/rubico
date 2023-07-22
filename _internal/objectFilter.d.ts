export = objectFilter;
/**
 * @name objectFilter
 *
 * @synopsis
 * ```coffeescript [specscript]
 * objectFilter<T>(
 *   object Object<T>,
 *   predicate T=>boolean,
 * ) -> result Object<T>
 * ```
 */
declare function objectFilter(object: any, predicate: any): any;
