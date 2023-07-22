export = asyncIteratorEvery;
/**
 * @name asyncIteratorEvery
 *
 * @synopsis
 * var T any,
 *   asyncIterator AsyncIterator<T>,
 *   predicate T=>Promise|boolean,
 *   promisesInFlight Set<Promise<[T, Promise]>>,
 *   maxConcurrency number
 *
 * asyncIteratorEvery(
 *   asyncIterator, predicate, promisesInFlight, maxConcurrency,
 * ) -> Promise<boolean>
 */
declare function asyncIteratorEvery(asyncIterator: any, predicate: any, promisesInFlight: any, maxConcurrency?: number): Promise<boolean>;
