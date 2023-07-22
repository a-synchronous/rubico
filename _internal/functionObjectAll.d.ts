export = functionObjectAll;
/**
 * @name functionObjectAll
 *
 * @synopsis
 * ```coffeescript [specscript]
 * functionObjectAll(funcs Array<function>, args Array) -> Promise|Object
 * ```
 *
 * @description
 * Concurrently execute the same arguments for each function of an object of functions, returning an object of results.
 */
declare function functionObjectAll(funcs: any, args: any): any;
