export = arrayMapPool;
/**
 * @name
 * arrayMapPool
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayMapPool<
 *   T any,
 *   array Array<T>
 *   mapper T=>Promise|any,
 *   concurrentLimit number,
 * >(array, mapper, concurrentLimit) -> Promise|Array
 * ```
 *
 * @description
 * Apply a mapper with limited concurrency to each element of an array, returning an array of results.
 */
declare function arrayMapPool(array: any, mapper: any, concurrentLimit: any): any[] | Promise<any>;
