export = mapFilter;
/**
 * @name mapFilter
 *
 * @synopsis
 * ```coffeescript [specscript]
 * mapFilter<
 *   T any,
 *   map Map<any=>T>,
 *   predicate T=>Promise|boolean,
 * >(map, predicate) -> filteredValuesByPredicate Map<any=>T>
 * ```
 *
 * @description
 * Filter the values of a Map concurrently by predicate. `predicate` may be asynchronous.
 *
 * Note: for asynchronous predicates, the order of the resulting Map is not guaranteed
 *
 * @TODO mapFilterSeries (will guarantee order for asynchronous predicates)
 */
declare function mapFilter(map: any, predicate: any): any;
