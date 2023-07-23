export = timeInLoop;
/**
 * @name timeInLoop
 *
 * @synopsis
 * ```coffeescript [specscript]
 * timeInLoop(description string, loopCount number, fn function, options? {
 *   silent?: boolean,
 * }) -> undefined
 * ```
 *
 * @description
 * Logs the amount of time required for a function to run a certain number of times
 *
 * ```js
 * timeInLoop('hello', 1e6, () => 'hello') // hello: 1e+6: 3.474ms
 * ```
 *
 * Reference: https://gist.github.com/funfunction/91b5876a5f562e1e352aed0fcabc3858
 */
declare function timeInLoop(description: any, loopCount: any, fn: any, options?: {}): {
    description: any;
    loopCount: any;
    duration: number;
};
