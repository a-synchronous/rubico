export = arrayFilterByConditions;
/**
 * @name arrayFilterByConditions
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayFilterByConditions(
 *   array Array,
 *   result Array,
 *   index number,
 *   conditions Array<boolean>,
 * ) -> result
 * ```
 *
 * @description
 * Filter an array by a boolean array of conditions
 *
 * @TODO switch positions of index and conditions
 */
declare function arrayFilterByConditions(array: any, result: any, index: any, conditions: any): any;
