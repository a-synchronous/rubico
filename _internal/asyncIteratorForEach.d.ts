export = asyncIteratorForEach;
/**
 * @name asyncIteratorForEach
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var T any,
 *   asyncIterator AsyncIterator<T>,
 *   callback T=>()
 *
 * asyncIteratorForEach(asyncIterator, callback) -> Promise<>
 * ```
 *
 * @description
 * Execute a callback function for each element of an async iterator
 */
declare function asyncIteratorForEach(asyncIterator: any, callback: any): Promise<any>;
