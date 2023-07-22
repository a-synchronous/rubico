export = arraySome;
/**
 * @name arraySome
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arraySome(
 *   array Array,
 *   predicate any=>Promise|boolean,
 * ) -> boolean
 * ```
 */
declare function arraySome(array: any, predicate: any): boolean | Promise<boolean>;
