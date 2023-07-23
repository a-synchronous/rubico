export = timeInLoop;
/**
 * @name timeInLoop
 *
 * @synopsis
 * timeInLoop(desc string, loopCount number, fn function) -> undefined
 *
 * @description
 * Logs the amount of time required for a function to run a certain number of times
 *
 * ```coffeescript [specscript]
 * timeInLoop('hello', 1e6, () => 'hello') // hello: 1e+6: 3.474ms
 * ```
 *
 * Reference: https://gist.github.com/funfunction/91b5876a5f562e1e352aed0fcabc3858
 */
declare const timeInLoop: (description: any, loopCount: any, fn: any, options?: {}) => {
    description: any;
    loopCount: any;
    duration: number;
};
