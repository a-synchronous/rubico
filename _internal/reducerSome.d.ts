export = reducerSome;
/**
 * @name reducerSome
 *
 * @synopsis
 * ```coffeescript [specscript]
 * reducerSome(
 *   predicate any=>boolean,
 * ) -> anyReducer (result boolean, item any)=>boolean
 * ```
 *
 * @related foldableAllReducer
 *
 * @TODO throw to break early?
 */
declare function reducerSome(predicate: any): (result: any, item: any) => any;
