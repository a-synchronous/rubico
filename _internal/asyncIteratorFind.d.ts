export = asyncIteratorFind;
/**
 * @name asyncIteratorFind
 *
 * @synopsis
 * var T any,
 *   asyncIterator AsyncIterator<T>,
 *   predicate T=>Promise|boolean
 *
 * asyncIteratorFind(asyncIterator, predicate) -> Promise|T|undefined
 */
declare function asyncIteratorFind(asyncIterator: any, predicate: any): Promise<any>;
