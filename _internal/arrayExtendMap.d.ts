export = arrayExtendMap;
/**
 * @name arrayExtendMap
 *
 * @synopsis
 * ```coffeescript [specscript]
 * any -> value; any -> mapped
 *
 * arrayExtendMap(
 *   array Array<mapped>,
 *   values Array<value>,
 *   valuesIndex number,
 *   valuesMapper value=>mapped,
 * ) -> array
 * ```
 *
 * @description
 * `arrayExtend` while mapping
 */
declare function arrayExtendMap(array: any, values: any, valuesMapper: any, valuesIndex: any): any;
