const isArray = require('./_internal/isArray')
const funcAll = require('./_internal/funcAll')
const funcObjectAll = require('./_internal/funcObjectAll')
const funcAllSeries = require('./_internal/funcAllSeries')

/**
 * @name fork
 *
 * @synopsis
 * ```coffeescript [specscript]
 * fork<args ...any>(
 *   funcs Object<...args=>Promise|any>,
 * )(...args) -> result Promise|Object
 *
 * fork<args ...any>(
 *   funcs Array<...args=>Promise|any>,
 * )(...args) -> result Promise|Array
 * ```
 *
 * @description
 * A multi-purpose function, parallelizes multiple functions with concurrent execution into either an object, an array, or a nested mix of both. Has use cases in parallel execution and object composition.
 *
 * ```javascript [playground]
 * console.log(
 *   fork({
 *     greetings: fork([
 *       greeting => greeting + ' world',
 *       greeting => greeting + ' mom',
 *     ]),
 *   })('hello'),
 * ) // { greetings: ['hello world', 'hello mom'] }
 * ```
 *
 * @execution concurrent
 */
const fork = funcs => isArray(funcs) ? funcAll(funcs) : funcObjectAll(funcs)

/**
 * @name fork.series
 *
 * @synopsis
 * ```coffeescript [specscript]
 * fork.series<args ...any>(
 *   funcs Array<...args=>Promise|any>,
 * )(...args) -> Promise|Array
 * ```
 *
 * @description
 * `fork` with serial execution.
 *
 * ```javascript [playground]
 * const sleep = ms => () => new Promise(resolve => setTimeout(resolve, ms))
 *
 * fork.series([
 *   greeting => console.log(greeting + ' world'),
 *   sleep(1000),
 *   greeting => console.log(greeting + ' mom'),
 *   sleep(1000),
 *   greeting => console.log(greeting + ' darkness'),
 * ])('hello') // hello world
 *             // hello mom
 *             // hello darkness
 * ```
 *
 * @execution series
 */
fork.series = funcAllSeries

module.exports = fork
