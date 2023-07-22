export = spread2;
/**
 * @name spread2
 *
 * @synopsis
 * ```coffeescript [specscript]
 * spread2<
 *   func function,
 *   arg0 any,
 *   arg1 any,
 * >(func) -> spreading2 ([arg0, arg1])=>func(arg0, arg1)
 * ```
 */
declare function spread2(func: any): ([arg0, arg1]: [any, any]) => any;
