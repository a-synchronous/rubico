export = reducerEvery;
/**
 * @name reducerEvery
 *
 * @synopsis
 * ```coffeescript [specscript]
 * reducerEvery(
 *   predicate any=>boolean,
 * ) -> reducer(result boolean, element any)=>boolean
 * ```
 */
declare function reducerEvery(predicate: any): (result: any, element: any) => any;
