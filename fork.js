const isArray = require('./_internal/isArray')
const funcAll = require('./_internal/funcAll')
const funcObjectAll = require('./_internal/funcObjectAll')
const funcAllSeries = require('./_internal/funcAllSeries')

/**
 * @name fork
 *
 * @synopsis
 * ```coffeescript [specscript]
 * fork(funcsArray Array<function>)(...args) -> result Promise|Array
 *
 * fork(funcsObject Object<function>)(...args) -> result Promise|Object
 * ```
 *
 * @description
 * Function executor and composer. Accepts either an array of functions or an object of functions as the values. Calls each function of the provided array or object in parallel with the provided arguments. Returns either an array or object of the results of the function executions.
 *
 * ```javascript [playground]
 * const createArrayOfGreetingsFor = fork([
 *   name => `Hi ${name}`,
 *   name => `Hey ${name}`,
 *   name => `Hello ${name}`,
 * ])
 *
 * const arrayOfGreetingsForFred = createArrayOfGreetingsFor('Fred')
 *
 * console.log(arrayOfGreetingsForFred)
 * // ['Hi Fred', 'Hey Fred', 'Hello Fred']
 *
 * const createObjectOfGreetingsFor = fork({
 *   hi: name => `Hi ${name}`,
 *   hey: name => `Hey ${name}`,
 *   hello: name => `Hello ${name}`,
 * })
 *
 * const objectOfGreetingsForJane = createObjectOfGreetingsFor('Jane')
 *
 * console.log(objectOfGreetingsForJane)
 * // { hi: 'Hi Jane', hey: 'Hey Jane', hello: 'Hello Jane' }
 * ```
 *
 * `fork` can simultaneously compose objects and handle promises.
 *
 * ```javascript [playground]
 * const identity = value => value
 *
 * const userbase = new Map()
 * userbase.set('1', { _id: 1, name: 'George' })
 *
 * const getUserByID = async id => userbase.get(id)
 *
 * const getAndLogUserById = pipe([
 *   fork({
 *     id: identity,
 *     user: getUserByID,
 *   }),
 *   tap(({ id, user }) => {
 *     console.log(`Got user ${JSON.stringify(user)} by id ${id}`)
 *   }),
 * ])
 *
 * getAndLogUserById('1') // Got user {"_id":1,"name":"George"} by id 1
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
 * fork.series(funcsArray Array<function>)(...args) -> result Promise|Array
 *
 * fork.series(funcsObject Object<function>)(...args) -> result Promise|Object
 * ```
 *
 * @description
 * Same as `fork` but with serial instead of parallel execution.
 *
 * ```javascript [playground]
 * const sleep = ms => () => new Promise(resolve => setTimeout(resolve, ms))
 *
 * fork.series([
 *   greeting => console.log(greeting + ' world'),
 *   sleep(1000),
 *   greeting => console.log(greeting + ' mom'),
 *   sleep(1000),
 *   greeting => console.log(greeting + ' goodbye'),
 * ])('hello') // hello world
 *             // hello mom
 *             // hello goodbye
 * ```
 *
 * @execution series
 */
fork.series = funcs => isArray(funcs) ? funcAllSeries(funcs) : funcObjectAll(funcs)

module.exports = fork
