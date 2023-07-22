export = reducerConcat;
/**
 * @name reducerConcat
 *
 * @synopsis
 * ```coffeescript [specscript]
 * reducerConcat<
 *   T any,
 *   intermediate any,
 *   reducerA (any, T)=>Promise|intermediate,
 *   reducerB (intermediate, T)=>Promise|any,
 * >(reducerA, reducerB) -> pipedReducer (any, T)=>Promise|any
 * ```
 */
declare function reducerConcat(reducerA: any, reducerB: any): (result: any, item: any) => any;
