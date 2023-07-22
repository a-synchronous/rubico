export = reducerEvery;
/**
 * @name reducerEvery
 *
 * @synopsis
 * ```coffeescript [specscript]
 * reducerEvery(
 *   predicate any=>boolean,
 * ) -> reducer(result boolean, item any)=>boolean
 * ```
 */
declare function reducerEvery(predicate: any): (result: any, item: any) => any;
