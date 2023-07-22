export = funcConcatSync;
/**
 * @name funcConcatSync
 *
 * @synopsis
 * ```coffeescript [specscript]
 * funcConcatSync<
 *   args ...any,
 *   intermediate any,
 *   result any,
 * >(
 *   funcA ...args=>intermediate,
 *   funcB intermediate=>result
 * ) -> pipedFunction ...args=>result
 * ```
 */
declare function funcConcatSync(funcA: any, funcB: any): (...args: any[]) => any;
