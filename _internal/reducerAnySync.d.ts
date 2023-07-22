export = reducerAnySync;
/**
 * @name reducerAnySync
 *
 * @synopsis
 * ```coffeescript [specscript]
 * reducerAnySync(predicate T=>boolean) -> anyReducer (any, any)=>any
 * ```
 */
declare function reducerAnySync(predicate: any): (result: any, item: any) => any;
