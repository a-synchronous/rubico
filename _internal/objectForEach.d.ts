export = objectForEach;
/**
 * @name objectForEach
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var T any,
 *   object Object<T>,
 *   callback T=>()
 *
 * objectForEach(object, callback) -> ()
 * ```
 *
 * @description
 * Execute a callback for each value of an object. Return a promise if any executions are asynchronous.
 */
declare function objectForEach(object: any, callback: any): any;
