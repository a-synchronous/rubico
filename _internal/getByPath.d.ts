export = getByPath;
/**
 * @name getByPath
 *
 * @synopsis
 * ```coffeescript [specscript]
 * getByPath<
 *   value any,
 *   path string|number|Array<string|number>,
 * >(value, path) -> valueAtPath any
 * ```
 */
declare function getByPath(value: any, path: any): any;
