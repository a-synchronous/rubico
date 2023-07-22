export = arrayForEach;
/**
 * @name arrayForEach
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var T any,
 *   array Array<T>,
 *   callback T=>()
 *
 * arrayForEach(array, callback) -> ()
 * ```
 *
 * @description
 * Call a callback for each item of an iterator. Return a promise if any executions are asynchronous.
 *
 * Note: iterator is consumed
 */
declare function arrayForEach(array: any, callback: any): any;
