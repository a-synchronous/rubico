const isPromise = require('./_internal/isPromise')
const areAnyValuesPromises = require('./_internal/areAnyValuesPromises')
const areAllValuesNonfunctions = require('./_internal/areAllValuesNonfunctions')
const promiseAll = require('./_internal/promiseAll')
const promiseObjectAll = require('./_internal/promiseObjectAll')
const isArray = require('./_internal/isArray')
const __ = require('./_internal/placeholder')
const curry2 = require('./_internal/curry2')
const curryArgs2 = require('./_internal/curryArgs2')
const functionArrayAll = require('./_internal/functionArrayAll')
const functionArrayAllSeries = require('./_internal/functionArrayAllSeries')
const functionObjectAll = require('./_internal/functionObjectAll')

/**
 * @name _allValues
 *
 * @synopsis
 * ```coffeescript [specscript]
 * _allValues(values Array<Promise|any>) -> Promise<Array>
 * _allValues(values Object<Promise|any>) -> Promise<Object>
 * ```
 */
const _allValues = function (values) {
  if (isArray(values)) {
    return areAnyValuesPromises(values)
      ? promiseAll(values)
      : values
  }
  return areAnyValuesPromises(values)
    ? promiseObjectAll(values)
    : values
}

/**
 * @name all
 *
 * @synopsis
 * ```coffeescript [specscript]
 * all(values Promise|Array<Promise|any>) -> result Promise|Array
 * all(values Promise|Object<Promise|any>) -> result Promise|Object
 *
 * all(
 *   ...args,
 *   resolversOrValues Array<function|Promise|any>
 * ) -> result Promise|Array
 *
 * all(
 *   resolversOrValues Array<function|Promise|any>
 * )(...args) -> result Promise|Array
 *
 * all(
 *   ...args,
 *   resolversOrValues Object<function|Promise|any>
 * ) -> result Promise|Object
 *
 * all(
 *   resolversOrValues Object<function|Promise|any>
 * )(...args) -> result Promise|Object
 * ```
 *
 * @description
 * Calls an array or object of resolver functions or values `resolversOrValues` with provided arguments.
 *
 * ```javascript [playground]
 * const createArrayOfGreetingsFor = all([
 *   name => `Hi ${name}`,
 *   name => `Hey ${name}`,
 *   name => `Hello ${name}`,
 * ])
 *
 * const arrayOfGreetingsFor1 = createArrayOfGreetingsFor('1')
 *
 * console.log(arrayOfGreetingsFor1)
 * // ['Hi 1', 'Hey 1', 'Hello 1']
 * ```
 *
 * If provided only values for `resolversOrValues`, returns an array or object with the same shape as `resolversOrValues` with any Promises resolved.
 *
 * ```javascript [playground]
 * all([
 *   Promise.resolve(1),
 *   Promise.resolve(2),
 *   3,
 * ]).then(console.log) // [1, 2, 3]
 *
 * all({
 *   a: Promise.resolve(1),
 *   b: Promise.resolve(2),
 *   c: 3,
 * }).then(console.log) // { a: 1, b: 2, c: 3 }
 * ```
 *
 * `all` can be used in a pipeline to compose and manpulate data.
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
 * Values passed in resolver position are set on the result object or array directly. If any of these values are promises, they are resolved for their values before being set on the result object or array.
 *
 * ```javascript [playground]
 * all({}, [
 *   Promise.resolve(1),
 * ])
 * ```
 *
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * all(Promise.resolve({ a: 1 }), [
 *   obj => obj.a + 1,
 *   obj => obj.a + 2,
 *   obj => obj.a + 3,
 * ]).then(console.log) // [2, 3, 4]
 * ```
 *
 * @execution concurrent
 */
const all = function (...args) {
  if (args.length == 1) {
    const resolversOrValues = args[0]
    if (isPromise(resolversOrValues)) {
      return resolversOrValues.then(_allValues)
    }
    if (areAllValuesNonfunctions(resolversOrValues)) {
      return _allValues(resolversOrValues)
    }
    return isArray(resolversOrValues)
      ? curryArgs2(functionArrayAll, resolversOrValues, __)
      : curryArgs2(functionObjectAll, resolversOrValues, __)
  }

  const resolversOrValues = args[args.length - 1]
  const argValues = args.slice(0, -1)

  if (areAnyValuesPromises(argValues)) {
    return isArray(resolversOrValues)
      ? promiseAll(argValues)
        .then(curry2(functionArrayAll, resolversOrValues, __))
      : promiseAll(argValues)
        .then(curry2(functionObjectAll, resolversOrValues, __))
  }

  return isArray(resolversOrValues)
    ? functionArrayAll(resolversOrValues, argValues)
    : functionObjectAll(resolversOrValues, argValues)

  /*
  ////////////////////////////////////////////////////////////////
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
  */
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
