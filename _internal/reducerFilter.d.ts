export = reducerFilter;
/**
 * @name reducerFilter
 *
 * @synopsis
 * ```coffeescript [specscript]
 * reducerFilter<
 *   T any,
 *   reducer (any, T)=>Promise|any,
 *   predicate T=>Promise|boolean,
 * >(reducer, predicate) -> filteringReducer (any, any)=>Promise|any
 * ```
 *
 * @description
 * Filter items from a reducer's operation by predicate. `predicate` may be asynchronous.
 *
 * Note: If the predicate is asynchronous, the implementation of reduce that consumes the filtering reducer must resolve promises
 */
declare function reducerFilter(reducer: any, predicate: any): (result: any, item: any) => any;
