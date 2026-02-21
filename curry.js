const curryArity = require('./_internal/curryArity')

/**
 * @name curry
 *
 * @synopsis
 * ```coffeescript [specscript]
 * __ Symbol(placeholder)
 *
 * type ArgsWithPlaceholder = Array<__|any>
 *
 * args ArgsWithPlaceholder
 * moreArgs ArgsWithPlaceholder
 *
 * curry(func function, ...args) -> curriedFuncOrResult function|any
 * curriedFuncOrResult(...moreArgs) -> anotherCurriedFuncOrResult function|any
 * ```
 *
 * @description
 * Enables partial application of a function's arguments in any order. Provide the placeholder value `__` to specify an argument to be resolved in the partially applied function.
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
 *
 * See also:
 *  * [eq](/docs/eq)
 *  * [thunkify](/docs/thunkify)
 *  * [always](/docs/always)
 *  * [curry.arity](/docs/curry.arity)
 *  * [curry.call](/docs/curry.call)
 *  * [__](/docs/__)
 *  * [Transducer.map](/docs/Transducer.map)
 *
 */
const curry = (func, ...args) => curryArity(func.length, func, this, args)

/**
 * @name curry.arity
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type __ = Symbol(placeholder)
 * type ArgsWithPlaceholder = Array<__|any>
 *
 * n number
 * args ArgsWithPlaceholder
 * moreArgs ArgsWithPlaceholder
 *
 * curry.arity(n number, func function, ...args) -> curriedFuncOrResult function|any
 * curriedFuncOrResult(...moreArgs) -> anotherCurriedFuncOrResult function|any
 * ```
 *
 * @description
 * [curry](/docs/curry) with specified arity (number of arguments taken by the function) as the first parameter.
 *
 * ```javascript [playground]
 * const add = (a, b, c = 0) => a + b + c
 *
 * console.log(curry.arity(2, add, 1, 2)) // 3
 * ```
 *
 * See also:
 *  * [eq](/docs/eq)
 *  * [thunkify](/docs/thunkify)
 *  * [always](/docs/always)
 *  * [curry](/docs/curry)
 *  * [curry.call](/docs/curry.call)
 *  * [__](/docs/__)
 *  * [Transducer.map](/docs/Transducer.map)
 *
 */
curry.arity = function curryArity_(arity, func, ...args) {
  return curryArity(arity, func, this, args)
}

/**
 * @name curry.call
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type __ = Symbol(placeholder)
 * type ArgsWithPlaceholder = Array<__|any>
 *
 * n number
 * args ArgsWithPlaceholder
 * moreArgs ArgsWithPlaceholder
 *
 * curry.call(func function, context object, ...args) -> curriedFuncOrResult function|any
 * curriedFuncOrResult(...moreArgs) -> anotherCurriedFuncOrResult function|any
 * ```
 *
 * @description
 * [curry](/docs/curry) with specified context.
 *
 * ```javascript [playground]
 * class Point {
 *   constructor(x, y) {
 *     this.x = x
 *     this.y = y
 *   }
 *
 *   toString() {
 *     return `(${this.x}, ${this.y})`
 *   }
 * }
 *
 * const point = new Point(100, 100)
 *
 * const box = { x: 5, y: 10 }
 *
 * console.log(curry.call(point.toString, point))
 * console.log(curry.call(point.toString, box))
 * ```
 *
 * See also:
 *  * [eq](/docs/eq)
 *  * [thunkify](/docs/thunkify)
 *  * [always](/docs/always)
 *  * [curry](/docs/curry)
 *  * [curry.arity](/docs/curry.arity)
 *  * [__](/docs/__)
 *  * [Transducer.map](/docs/Transducer.map)
 *
 */
curry.call = function call(func, context, ...args) {
  return curryArity(func.length, func, context, args)
}


module.exports = curry
