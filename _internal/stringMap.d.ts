export = stringMap;
/**
 * @name stringMap
 *
 * @synopsis
 * ```coffeescript [specscript]
 * stringMap<
 *   character string,
 *   str String<character>,
 *   mapper character=>Promise|string|any,
 * >(str, mapper) -> stringWithCharactersMapped string
 * ```
 *
 * @description
 * Apply a mapper concurrently to each character of a string, returning a string result. `mapper` may be asynchronous.
 *
 * @related stringFlatMap
 */
declare function stringMap(string: any, mapper: any): any;
