export = arrayFilter;
/**
 * @name arrayFilter
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayFilter<T>(
 *   array Array<T>,
 *   predicate T=>Promise|boolean,
 * ) -> result Promise|Array<T>
 * ```
 *
 * @description
 * Filter an array concurrently by predicate. `predicate` may be asynchronous.
 */
declare function arrayFilter(array: any, predicate: any): any;
