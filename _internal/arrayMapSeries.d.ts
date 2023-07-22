export = arrayMapSeries;
/**
 * @name arrayMapSeries
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayMapSeries<
 *   T any,
 *   array Array<T>,
 *   mapper T=>Promise|any,
 * >(array, mapper) -> mappedInSeries Promise|Array
 * ```
 *
 * @description
 * Apply a mapper in series to each item of an array, returning an array of results.
 */
declare function arrayMapSeries(array: any, mapper: any): any;
