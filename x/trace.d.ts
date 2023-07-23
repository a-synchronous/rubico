export = trace;
/**
 * @name trace
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var args ...any,
 *   resolved any,
 *   resolver ...args=>resolved
 *
 * trace(...args) -> args[0]
 *
 * trace(resolver)(...args) -> resolved
 * ```
 *
 * @description
 * Log a value out to the console, returning the value. If the value is a function, treat it as a resolver.
 *
 * ```javascript [playground]
 * import trace from 'https://unpkg.com/rubico/dist/x/trace.es.js'
 *
 * pipe([
 *   trace,
 *   trace(value => value.toUpperCase()),
 * ])('hey') // hey
 *           // HEY
 * console.log('check your console')
 * ```
 */
declare function trace(...args: any[]): any;
