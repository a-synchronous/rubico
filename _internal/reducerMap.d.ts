export = reducerMap;
/**
 * @name reducerMap
 *
 * @synopsis
 * ```coffeescript [specscript]
 * reducerMap<
 *   T any,
 *   reducer (any, T)=>Promise|any,
 *   mapper T=>Promise|any,
 * >(reducer, mapper) -> mappingReducer (any, any)=>Promise|any
 * ```
 *
 * @description
 * Apply a mapper to elements of a reducer's operation. `mapper` may be asynchronous
 *
 * Note: If the mapper is asynchronous, the implementation of reduce that consumes the mapping reducer must resolve promises
 */
declare function reducerMap(reducer: any, mapper: any): (result: any, reducerItem: any) => any;
