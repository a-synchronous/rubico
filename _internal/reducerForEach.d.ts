export = reducerForEach;
/**
 * @name reducerForEach
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Reducer<T> = (any, T)=>Promise|any
 *
 * var T any,
 *   reducer Reducer<T>
 *
 * reducerForEach(reducer, callback) -> reducer
 * ```
 *
 * @description
 * Create a reducer that additionally executes a callback for each element of its reducing operation.
 */
declare function reducerForEach(reducer: any, callback: any): (result: any, element: any) => any;
