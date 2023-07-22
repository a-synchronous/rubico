export = stringFilter;
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
 * Filter a string's characters by predicate.
 */
declare function stringFilter(string: any, predicate: any): any;
