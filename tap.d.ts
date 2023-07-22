export = tap;
/**
 * @name tap
 *
 * @synopsis
 * ```coffeescript [specscript]
 * tap(...args, func function) -> Promise|args[0]
 * tap(func function)(...args) -> Promise|args[0]
 * ```
 *
 * @description
 * Call a function with any number of arguments, returning the first argument. Promises created by the tapper are resolved before returning the value.
 *
 * ```javascript [playground]
 * const pipeline = pipe([
 *   tap(value => console.log(value)),
 *   tap(value => console.log(value + 'bar')),
 *   tap(value => console.log(value + 'barbaz')),
 * ])
 *
 * pipeline('foo') // 'foo'
 *                 // 'foobar'
 *                 // 'foobarbaz'
 * ```
 */
declare function tap(...args: any[]): any;
declare namespace tap {
    /**
     * @name tap.if
     *
     * @synopsis
     * ```coffeescript [specscript]
     * tap.if(predicate function, func function)(...args) -> Promise|args[0]
     * ```
     *
     * @description
     * A version of `tap` that accepts a predicate function (a function that returns a boolean value) before the function to execute. Only executes the function if the predicate function tests true for the same arguments provided to the execution function.
     *
     * ```javascript [playground]
     * const isOdd = number => number % 2 == 1
     *
     * const logIfOdd = tap.if(
     *   isOdd,
     *   number => console.log(number, 'is an odd number')
     * )
     *
     * logIfOdd(2)
     * logIfOdd(3) // 3 is an odd number
     * ```
     */
    function _if(predicate: any, func: any): (...args: any[]) => any;
    export { _if as if };
}
