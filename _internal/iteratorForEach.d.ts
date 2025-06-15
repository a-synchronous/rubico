export = iteratorForEach;
/**
 * @name iteratorForEach
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var T any,
 *   iterator Iterator<T>,
 *   callback T=>()
 *
 * iteratorForEach(iterator, callback) -> ()
 * ```
 *
 * @description
 * Call a callback for each element of an iterator. Return a promise if any executions are asynchronous.
 *
 * Note: iterator is consumed
 */
declare function iteratorForEach(iterator: any, callback: any): any;
