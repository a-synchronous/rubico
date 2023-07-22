export = asyncIteratorSome;
/**
 * @name asyncIteratorSome
 *
 * @synopsis
 * ```coffeescript [specscript]
 * asyncIteratorSome(
 *   iterator Iterator|AsyncIterator,
 *   predicate any=>Promise|boolean,
 *   index number,
 *   promisesInFlight Set<Promise>,
 *   maxConcurrency number=20,
 * ) -> boolean
 * ```
 */
declare function asyncIteratorSome(iterator: any, predicate: any, promisesInFlight: any, maxConcurrency?: number): Promise<boolean>;
