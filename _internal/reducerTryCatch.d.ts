export = reducerTryCatch;
/**
 * @name reducerTryCatch
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Reducer = (accum any, item any)=>(nextAccumulator Promise|any)
 *
 * reducerTryCatch(
 *   reducer function,
 *   catcher function,
 * ) -> errorHandlingReducer function
 * ```
 */
declare function reducerTryCatch(reducer: any, transducerTryer: any, catcher: any): (accum: any, item: any) => any;
