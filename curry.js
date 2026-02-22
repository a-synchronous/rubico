const areAnyValuesPromises = require('./_internal/areAnyValuesPromises')
const promiseAll = require('./_internal/promiseAll')
const __ = require('./_internal/placeholder')
const curry4 = require('./_internal/curry4')
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
 * console.log(curry(add, 'a', 'b', 'c'))
 * console.log(curry(add)('a', 'b', 'c'))
 * console.log(curry(add, 'a')('b', 'c'))
 * console.log(curry(add, 'a', 'b')('c'))
 * console.log(curry(add)('a')('b')('c'))
 *
 * console.log(curry(add, __, 'b', 'c')('a'))
 * console.log(curry(add, __, __, 'c')('a', 'b'))
 * console.log(curry(add, __, __, 'c')(__, 'b')('a'))
 * ```
 *
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * const add = (a, b, c) => a + b + c
 *
 * curry(add, Promise.resolve('a'), 'b', 'c').then(console.log)
 *
 * let curried = await curry(add, __, __, Promise.resolve('c'))
 * curried = await curried(__, Promise.resolve('b'))
 * console.log(curried('a'))
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
const curry = (func, ...args) => {
  if (areAnyValuesPromises(args)) {
    return promiseAll(args).then(curry4(curryArity, func.length, func, this, __))
  }
  return curryArity(func.length, func, this, args)
}

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
  if (areAnyValuesPromises(args)) {
    return promiseAll(args).then(curry4(curryArity, arity, func, this, __))
  }
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
  if (areAnyValuesPromises(args)) {
    return promiseAll(args).then(curry4(curryArity, func.length, func, context, __))
  }
  return curryArity(func.length, func, context, args)
}


module.exports = curry
