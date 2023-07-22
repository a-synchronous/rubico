export = funcConcat;
/**
 * @name funcConcat
 *
 * @synopsis
 * ```coffeescript [specscript]
 * funcConcat<
 *   args ...any,
 *   intermediate any,
 *   result any,
 * >(
 *   funcA ...args=>Promise|intermediate,
 *   funcB intermediate=>result
 * ) -> pipedFunction ...args=>Promise|result
 * ```
 */
declare function funcConcat(funcA: any, funcB: any): (...args: any[]) => any;
