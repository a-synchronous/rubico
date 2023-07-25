export = timeInLoopAsync;
/**
 * @name timeInLoopAsync
 *
 * @synopsis
 * ```coffeescript [specscript]
 * timeInLoop.async(description string, loopCount number, fn function, options? {
 *   silent?: boolean,
 * }) -> undefined
 * ```
 *
 * @description
 * Like timeInLoop, but every call is awaited
 *
 * ```js
 * timeInLoop.async('async hello', 1e6, async () => 'hello') // async hello: 1e+6: 116.006ms
 * ```
 */
declare function timeInLoopAsync(description: any, loopCount: any, fn: any, options?: {}): Promise<{
    description: any;
    loopCount: any;
    duration: number;
}>;
