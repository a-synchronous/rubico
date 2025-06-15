export = setFilter;
/**
 * @name setFilter
 *
 * @synopsis
 * ```coffeescript [specscript]
 * setFilter<T>(
 *   set Set<T>,
 *   predicate T=>Promise|boolean,
 * ) -> filteredSet Promise|Set<T>
 * ```
 *
 * @description
 * Filter elements of a Set concurrently by predicate. `predicate` may be asynchronous.
 */
declare function setFilter(value: any, predicate: any): any;
