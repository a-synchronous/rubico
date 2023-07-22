export = genericTransform;
/**
 * @name genericTransform
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Reducer = (any, any)=>Promise|any
 * Semigroup = Array|string|Set|TypedArray
 *   |{ concat: function }|{ write: function }|Object
 *
 * genericTransform<
 *   collection any,
 *   transducer Reducer=>Reducer,
 *   accum Semigroup|any,
 * >(collection, transducer, accum) -> accum
 * ```
 */
declare function genericTransform(collection: any, transducer: any, accum: any): any;
