export = objectSetIf;
/**
 * @name objectSetIf
 *
 * @synopsis
 * ```coffeescript [specscript]
 * objectSetIf<
 *   object Object,
 *   key string,
 *   value any,
 *   condition boolean,
 * >(object, key, value, condition) -> object
 * ```
 */
declare function objectSetIf(object: any, key: any, value: any, condition: any): void;
