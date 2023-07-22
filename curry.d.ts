export = curry;
/**
 * @name curry
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type __ = Symbol(placeholder)
 * type ArgsWithPlaceholder = Array<__|any>
 *
 * args ArgsWithPlaceholder
 * moreArgs ArgsWithPlaceholder
 *
 * curry(
 *   func function,
 *   ...args
 * ) -> curriedFuncOrResult function|any
 *
 * curriedFuncOrResult(...moreArgs) -> anotherCurriedFuncOrResult function|any
 * ```
 *
 * @description
 * Enable partial application of a function's arguments in any order. Provide the placeholder value `__` to specify an argument to be resolved in the partially applied function.
 *
 * ```javascript [playground]
 * const add = (a, b, c) => a + b + c
 *
 * console.log(curry(add, 'a', 'b', 'c')) // 'abc'
 * console.log(curry(add)('a', 'b', 'c')) // 'abc'
 * console.log(curry(add, 'a')('b', 'c')) // 'abc'
 * console.log(curry(add, 'a', 'b')('c')) // 'abc'
 * console.log(curry(add)('a')('b')('c')) // 'abc'
 *
 * console.log(curry(add, __, 'b', 'c')('a')) // abc
 * console.log(curry(add, __, __, 'c')('a', 'b')) // abc
 * console.log(curry(add, __, __, 'c')(__, 'b')('a')) // abc
 * ```
 */
declare function curry(func: any, ...args: any[]): any;
declare namespace curry {
    /**
     * @name curry.arity
     *
     * @synopsis
     * ```coffeescript [specscript]
     * type __ = Symbol(placeholder)
     * type ArgsWithPlaceholder = Array<__|any>
     *
     * args ArgsWithPlaceholder
     * moreArgs ArgsWithPlaceholder
     *
     * curry.arity(
     *   arity number,
     *   func function,
     *   ...args
     * ) -> curriedFuncOrResult function|any
     *
     * curriedFuncOrResult(...moreArgs) -> anotherCurriedFuncOrResult function|any
     * ```
     *
     * @description
     * `curry` with specified arity (number of arguments taken by the function) as the first parameter.
     *
     * ```javascript [playground]
     * const add = (a, b, c = 0) => a + b + c
     *
     * console.log(curry.arity(2, add, 1, 2)) // 3
     * ```
     */
    function arity(arity: any, func: any, ...args: any[]): any;
}
