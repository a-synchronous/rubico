const isArray = require('./_internal/isArray')
const funcAll = require('./_internal/funcAll')
const funcObjectAll = require('./_internal/funcObjectAll')
const funcAllSeries = require('./_internal/funcAllSeries')

/**
 * @name fork
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var args ...any,
 *   funcsArray Array<...args=>Promise|any>,
 *   funcsObject Object<...args=>Promise|any>
 *
 * fork(funcsArray)(...args) -> parallelized Promise|Array
 *
 * fork(funcsObject)(...args) -> parallelized Promise|Object
 * ```
 *
 * @description
 * Run an array or object of functions in parallel, returning an array or object result.
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
 * Use `fork` to simultaneously compose objects and handle async.
 *
 * ```javascript [playground]
 * const identity = value => value
 *
 * const userbase = new Map()
 * userbase.set('1', { _id: 1, name: 'George' })
 *
 * const getUserByID = async id => userbase.get(id)
 *
 * pipe([
 *   fork({
 *     id: identity,
 *     user: getUserByID,
 *   }),
 *   tap(({ id, user }) => {
 *     console.log(`Got user ${JSON.stringify(user)} by id ${id}`)
 *   }),
 * ])('1')
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
 * var args ...any,
 *   funcs Array<...args=>Promise|any>
 *
 * fork.series(funcs)(...args) => forkedInSeries Promise|Array
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
fork.series = funcs => isArray(funcs) ? funcAllSeries(funcs) : funcObjectAll(funcs)

module.exports = fork
