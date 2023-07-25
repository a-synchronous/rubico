export = iteratorFind;
/**
 * @name iteratorFind
 *
 * @synopsis
 * var T any,
 *   iterator Iterator<T>,
 *   predicate T=>Promise|boolean
 *
 * iteratorFind(iterator, predicate) -> Promise|T|undefined
 */
declare function iteratorFind(iterator: any, predicate: any): any;
