export = pipe;
/**
 * @name pipe
 *
 * @synopsis
 * ```coffeescript [specscript]
 * pipe(funcs Array<function>)(...args) -> result Promise|any
 *
 * pipe(...args, funcs Array<function>) -> result Promise|any
 * ```
 *
 * @description
 * Creates a function pipeline from an array of functions, where each function passes its return value as a single argument to the next function until all functions have executed. The first function is called with the arguments to the pipeline, while the result of the pipeline execution is the return of its last function. If any function of the pipeline is asynchronous, the result of the execution is a Promise.
 *
 * ```javascript [playground]
 * const syncAdd123 = pipe([
 *   number => number + 1,
 *   number => number + 2,
 *   number => number + 3,
 * ])
 *
 * console.log(syncAdd123(5)) // 11
 *
 * const asyncAdd123 = pipe([
 *   async number => number + 1,
 *   async number => number + 2,
 *   async number => number + 3,
 * ])
 *
 * asyncAdd123(5).then(console.log) // 11
 * ```
 *
 * When passed any amount of arguments before the array of functions, `pipe` executes eagerly; the array of functions is immediately invoked with the supplied arguments.
 *
 * ```javascript [playground]
 * pipe(1, 2, 3, [
 *   Array.of,
 *   map(number => number * 3),
 *   console.log, // [3, 6, 9]
 * ])
 * ```
 *
 * @execution series
 *
 * @transducing
 *
 * @since 1.6.0
 */
declare function pipe(...args: any[]): any;
