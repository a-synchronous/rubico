const areAnyValuesPromises = require('./_internal/areAnyValuesPromises')
const promiseAll = require('./_internal/promiseAll')
const isArray = require('./_internal/isArray')
const __ = require('./_internal/placeholder')
const curry2 = require('./_internal/curry2')
const curryArgs2 = require('./_internal/curryArgs2')
const functionArrayAll = require('./_internal/functionArrayAll')
const functionArrayAllSeries = require('./_internal/functionArrayAllSeries')
const functionObjectAll = require('./_internal/functionObjectAll')

/**
 * @name all
 *
 * @synopsis
 * ```coffeescript [specscript]
 * all(...args, funcsArray Array<function>) -> result Promise|Array
 *
 * all(funcsArray Array<function>)(...args) -> result Promise|Array
 *
 * all(...args, funcsObject Object<function>) -> result Promise|Object
 *
 * all(funcsObject Object<function>)(...args) -> result Promise|Object
 * ```
 *
 * @description
 * Function executor and composer. Accepts either an array of functions or an object of functions as the values. Calls each function of the provided array or object in parallel with the provided arguments. Returns either an array or object of the results of the function executions.
 *
 * ```javascript [playground]
 * const createArrayOfGreetingsFor = all([
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
 * const createObjectOfGreetingsFor = all({
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
 * `all` can simultaneously compose objects and handle promises.
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
 *   all({
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

const all = function (...args) {
  const funcs = args.pop()
  if (args.length == 0) {
    return isArray(funcs)
      ? curryArgs2(functionArrayAll, funcs, __)
      : curryArgs2(functionObjectAll, funcs, __)
  }

  if (areAnyValuesPromises(args)) {
    return isArray(funcs)
      ? promiseAll(args).then(curry2(functionArrayAll, funcs, __))
      : promiseAll(args).then(curry2(functionObjectAll, funcs, __))
  }

  return isArray(funcs)
    ? functionArrayAll(funcs, args)
    : functionObjectAll(funcs, args)
}

/**
 * @name all.series
 *
 * @synopsis
 * ```coffeescript [specscript]
 * all.series(...args, funcsArray Array<function>) -> result Promise|Array
 *
 * all.series(funcsArray Array<function>)(...args) -> result Promise|Array
 * ```
 *
 * @description
 * `all` with serial execution.
 *
 * ```javascript [playground]
 * const sleep = ms => () => new Promise(resolve => setTimeout(resolve, ms))
 *
 * all.series([
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

all.series = function allSeries(...args) {
  const funcs = args.pop()
  if (args.length == 0) {
    return curryArgs2(functionArrayAllSeries, funcs, __)
  }
  if (areAnyValuesPromises(args)) {
    return promiseAll(args).then(curry2(functionArrayAllSeries, funcs, __))
  }
  return functionArrayAllSeries(funcs, args)
}

module.exports = all
