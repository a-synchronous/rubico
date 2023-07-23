export = arrayFind;
/**
 * @name arrayFind
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var T any,
 *   array Array<T>,
 *   predicate T=>Promise|boolean,
 *   result Promise|T|undefined
 *
 * arrayFind(array, predicate) -> result
 * ```
 */
declare function arrayFind(array: any, predicate: any): any;
