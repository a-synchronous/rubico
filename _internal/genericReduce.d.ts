export = genericReduce;
/**
 * @name genericReduce
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Foldable<T> = Iterable<T>|AsyncIterable<T>
 *   |{ reduce: (any, T)=>any }|Object<T>
 *
 * genericReduce<T>(
 *   collection Foldable<T>,
 *   reducer (any, T)=>any,
 *   result any?,
 * ) -> result
 * ```
 *
 * @related genericReduceConcurrent
 *
 * @TODO genericReduceSync(collection, reducer, init) - performance optimization for some of these genericReduces that we know are synchronous
 *
 * @TODO genericReducePool(poolSize, collection, reducer, init) - for some of these genericReduces that we want to race - result should not care about order of concatenations
 * reduce.pool
 * transform.pool
 * flatMap.pool
 */
declare function genericReduce(collection: any, reducer: any, result: any): any;
