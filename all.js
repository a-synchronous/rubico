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
 * type SyncOrAsyncResolver = (...arguments)=>Promise|any
 * type ResolverOrValue = SyncOrAsyncResolver|Promise|any
 *
 * all(Promise|Array<Promise|any>) -> Promise|Array
 * all(...arguments, Array<ResolverOrValue>) -> Promise|Array
 * all(Array<ResolverOrValue>)(...arguments) -> Promise|Array
 *
 * all(Promise|Object<Promise|any>) -> Promise|Object
 * all(...arguments, Object<ResolverOrValue>) -> Promise|Object
 * all(Object<ResolverOrValue>)(...arguments) -> Promise|Object
 * ```
 *
 * @description
 * Function composer and data constructor. Constructs an array if provided an array of resolvers, promises, or values. Constructs an object if provided an object of resolvers, promises, or values. `all` returns a constructor function if provided resolvers. Otherwise, `all` returns the constructed array or object directly.
 *
 * ```javascript [playground]
 * const createArrayOfGreetings = all([
 *   name => `Hi ${name}`,
 *   name => `Hello ${name}`,
 *   name => `Greetings ${name}`,
 * ])
 *
 * const arrayOfGreetings = createArrayOfGreetings('example')
 *
 * console.log(arrayOfGreetingsFor1)
 * // ['Hi example', 'Hello example', 'Gretings example']
 * ```
 *
 * If provided promises, `all` resolves those promises and returns a promise of the resolved values.
 *
 * ```javascript [playground]
 * const promise1 = all([
 *   Promise.resolve(1),
 *   Promise.resolve(2),
 *   3,
 * ])
 *
 * promise1.then(console.log)
 *
 * const promise2 = all({
 *   a: 1,
 *   b: Promise.resolve(2),
 *   c: Promise.resolve(3),
 * })
 *
 * promise2.then(console.log)
 * ```
 *
 * If any resolvers provided to `all` are asynchronous, `all` returns a promise.
 *
 * ```javascript [playground]
 * const identity = value => value
 *
 * const userbase = new Map()
 * userbase.set('1', { id: 1, name: 'John' })
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
 * getAndLogUserById('1')
 * ```
 *
 * Any promises passed in argument position are resolved for their values before further execution.
 *
 * ```javascript [playground]
 * all(Promise.resolve({ a: 1 }), [
 *   obj => obj.a + 1,
 *   obj => obj.a + 2,
 *   obj => obj.a + 3,
 * ]).then(console.log)
 * ```
 *
 * See also:
 *  * [pipe](/docs/pipe)
 *  * [assign](/docs/assign)
 *  * [get](/docs/get)
 *  * [set](/docs/set)
 *  * [pick](/docs/pick)
 *  * [omit](/docs/omit)
 *  * [forEach](/docs/forEach)
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
}

/**
 * @name all.series
 *
 * @synopsis
 * ```coffeescript [specscript]
 * all.series(...arguments, Array<function>) -> Promise|Array
 *
 * all.series(Array<function>)(...arguments) -> Promise|Array
 * ```
 *
 * @description
 * `all` with serial execution.
 *
 * ```javascript [playground]
 * const sleep = ms => () => new Promise(resolve => setTimeout(resolve, ms))
 *
 * all.series('hello', [
 *   greeting => console.log(greeting + ' world'),
 *   sleep(1000),
 *   greeting => console.log(greeting + ' all'),
 *   sleep(1000),
 *   greeting => console.log(greeting + ' goodbye'),
 * ])
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
