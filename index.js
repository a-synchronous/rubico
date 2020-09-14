/**
 * rubico v1.5.13
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2020 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, rubico) {
  if (typeof module == 'object') (module.exports = rubico) // CommonJS
  else if (typeof define == 'function') define(() => rubico) // AMD
  else (root.rubico = rubico) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () {

'use strict'

/**
 * design principles
 *
 * rubico is a module, not a utility library
 * functional code should not care about async
 * exported methods are time and space optimal
 * memory used by exported methods is properly garbage collected
 * no special types; use built-in types
 * avoid variadic functions; use lists
 * avoid anonymous function creation; use names and factory functions
 * avoid creating functions inside functions
 */

const symbolIterator = Symbol.iterator

const symbolAsyncIterator = Symbol.asyncIterator

const globalThisHasBuffer = typeof Buffer == 'function'

const bufferAlloc = globalThisHasBuffer ? Buffer.alloc : function () {}

const objectValues = Object.values

const objectAssign = Object.assign

const objectProto = Object.prototype

const nativeObjectToString = objectProto.toString

const objectToString = x => nativeObjectToString.call(x)

const generatorFunctionTag = '[object GeneratorFunction]'

const asyncGeneratorFunctionTag = '[object AsyncGeneratorFunction]'

const promiseAll = Promise.all.bind(Promise)

const promiseRace = Promise.race.bind(Promise)

const isDefined = value => value != null

const isUndefined = value => typeof value == 'undefined'

const isNull = value => value === null

const isGeneratorFunction = value => objectToString(value) == generatorFunctionTag

const isAsyncGeneratorFunction = value => objectToString(value) == asyncGeneratorFunctionTag

const isIterator = value => value != null
  && typeof value.next == 'function'
  && typeof value[symbolIterator] == 'function'

const isAsyncIterator = value => value != null
  && typeof value.next == 'function'
  && typeof value[symbolAsyncIterator] == 'function'

const isIterable = value => value != null
  && typeof value[symbolIterator] == 'function'

const isAsyncIterable = value => value != null
  && typeof value[symbolAsyncIterator] == 'function'

const isNodeReadStream = value => value != null && typeof value.pipe == 'function'

const isWritable = value => value != null && typeof value.write == 'function'

const isFunction = value => typeof value == 'function'

const isArray = Array.isArray

const isObject = value => value != null && value.constructor == Object

const isSet = value => value != null && value.constructor == Set

const isMap = value => value != null && value.constructor == Map

const isBinary = ArrayBuffer.isView

const isNumber = function (value) {
  return typeof value == 'number'
    || (value != null && value.constructor == Number)
}

const isNaN = Number.isNaN

const isBigInt = x => typeof x == 'bigint'

const isString = value => typeof value == 'string'
  || (value != null && value.constructor == String)

const isPromise = value => value != null && typeof value.then == 'function'

const identity = value => value

const add = (a, b) => a + b

const range = (start, end) => Array.from({ length: end - start }, (x, i) => i + start)

const __ = Symbol('placeholder')

// argument resolver for curry2
const curry2ResolveArg0 = (
  baseFunc, arg1,
) => function arg0Resolver(arg0) {
  return baseFunc(arg0, arg1)
}

// argument resolver for curry2
const curry2ResolveArg1 = (
  baseFunc, arg0,
) => function arg1Resolver(arg1) {
  return baseFunc(arg0, arg1)
}

/**
 * @name curry2
 *
 * @synopsis
 * __ = Symbol('placeholder')
 *
 * curry2(
 *   baseFunc function,
 *   arg0 __|any,
 *   arg1 __|any,
 * ) -> function
 */
const curry2 = function (baseFunc, arg0, arg1) {
  return arg0 == __
    ? curry2ResolveArg0(baseFunc, arg1)
    : curry2ResolveArg1(baseFunc, arg0)
}

// argument resolver for curry3
const curry3ResolveArg0 = (
  baseFunc, arg1, arg2,
) => function arg0Resolver(arg0) {
  return baseFunc(arg0, arg1, arg2)
}

// argument resolver for curry3
const curry3ResolveArg1 = (
  baseFunc, arg0, arg2,
) => function arg1Resolver(arg1) {
  return baseFunc(arg0, arg1, arg2)
}

// argument resolver for curry3
const curry3ResolveArg2 = (
  baseFunc, arg0, arg1,
) => function arg2Resolver(arg2) {
  return baseFunc(arg0, arg1, arg2)
}

/**
 * @name curry3
 *
 * @synopsis
 * __ = Symbol('placeholder')
 *
 * curry3(
 *   baseFunc function,
 *   arg0 __|any,
 *   arg1 __|any,
 *   arg2 __|any
 * ) -> function
 */
const curry3 = function (baseFunc, arg0, arg1, arg2) {
  if (arg0 == __) {
    return curry3ResolveArg0(baseFunc, arg1, arg2)
  }
  if (arg1 == __) {
    return curry3ResolveArg1(baseFunc, arg0, arg2)
  }
  return curry3ResolveArg2(baseFunc, arg0, arg1)
}

// argument resolver for curry4
const curry4ResolveArg0 = (
  baseFunc, arg1, arg2, arg3,
) => function arg0Resolver(arg0) {
  return baseFunc(arg0, arg1, arg2, arg3)
}

// argument resolver for curry4
const curry4ResolveArg1 = (
  baseFunc, arg0, arg2, arg3,
) => function arg1Resolver(arg1) {
  return baseFunc(arg0, arg1, arg2, arg3)
}

// argument resolver for curry4
const curry4ResolveArg2 = (
  baseFunc, arg0, arg1, arg3,
) => function arg2Resolver(arg2) {
  return baseFunc(arg0, arg1, arg2, arg3)
}

// argument resolver for curry4
const curry4ResolveArg3 = (
  baseFunc, arg0, arg1, arg2,
) => function arg3Resolver(arg3) {
  return baseFunc(arg0, arg1, arg2, arg3)
}

/**
 * @name curry4
 *
 * @synopsis
 * __ = Symbol('placeholder')
 *
 * curry4(
 *   baseFunc function,
 *   arg0 __|any,
 *   arg1 __|any,
 *   arg2 __|any,
 *   arg3 __|any,
 * ) -> function
 */
const curry4 = function (baseFunc, arg0, arg1, arg2, arg3) {
  if (arg0 == __) {
    return curry4ResolveArg0(baseFunc, arg1, arg2, arg3)
  }
  if (arg1 == __) {
    return curry4ResolveArg1(baseFunc, arg0, arg2, arg3)
  }
  if (arg2 == __) {
    return curry4ResolveArg2(baseFunc, arg0, arg1, arg3)
  }
  return curry4ResolveArg3(baseFunc, arg0, arg1, arg2)
}

/**
 * @name always
 *
 * @synopsis
 * always(value any) -> getter ()=>value
 */
const always = value => function getter() { return value }

/**
 * @name thunkify1
 *
 * @synopsis
 * thunkify1(
 *   func function,
 *   arg0 any,
 * ) -> ()=>func(arg0)
 */
const thunkify1 = (func, arg0) => () => func(arg0)

/**
 * @name thunkify2
 *
 * @synopsis
 * thunkify2(
 *   func function,
 *   arg0 any,
 *   arg1 any,
 * ) -> ()=>func(arg0, arg1)
 */
const thunkify2 = (func, arg0, arg1) => () => func(arg0, arg1)

/**
 * @name thunkify3
 *
 * @synopsis
 * thunkify3(
 *   func function,
 *   arg0 any,
 *   arg1 any,
 *   arg2 any,
 * ) -> ()=>func(arg0, arg1, arg2)
 */
const thunkify3 = (func, arg0, arg1, arg2) => () => func(arg0, arg1, arg2)


/**
 * @name _arrayExtend
 *
 * @synopsis
 * _arrayExtend(array Array, values Array) -> array
 */
const _arrayExtend = function (array, values) {
  const arrayLength = array.length,
    valuesLength = values.length
  let valuesIndex = -1
  while (++valuesIndex < valuesLength) {
    array[arrayLength + valuesIndex] = values[valuesIndex]
  }
  return array
}

/**
 * @name arrayExtend
 *
 * @synopsis
 * arrayExtend(array Array, values Array) -> array
 */
const arrayExtend = function (array, values) {
  if (isArray(values)) {
    return _arrayExtend(array, values)
  }
  array.push(values)
  return array
}

/**
 * @name arrayExtendMap
 *
 * @catchphrase
 * internal extend while mapping
 *
 * @synopsis
 * any -> value; any -> mapped
 *
 * arrayExtendMap(
 *   array Array<mapped>,
 *   values Array<value>,
 *   valuesIndex number,
 *   valuesMapper value=>mapped,
 * ) -> array
 */
const arrayExtendMap = function (
  array, values, valuesMapper, valuesIndex,
) {
  const valuesLength = values.length
  let arrayIndex = array.length - 1
  while (++valuesIndex < valuesLength) {
    array[++arrayIndex] = valuesMapper(values[valuesIndex])
  }
  return array
}

/**
 * @name setAdd
 *
 * @synopsis
 * setAdd(set Set, item any) -> set
 */
const setAdd = (set, item) => set.add(item)

/**
 * @name setExtend
 *
 * @synopsis
 * setExtend(set, values Set|any) -> set
 *
 * @related arrayExtend
 */
const setExtend = function (set, values) {
  if (isSet(values)) {
    for (const value of values) {
      set.add(value)
    }
    return set
  }
  return set.add(values)
}

/**
 * @name setMap
 *
 * @synopsis
 * setMap(set Set, mapper function) -> result Set
 */
const setMap = function (set, mapper) {
  const result = new Set(),
    promises = []
  for (const item of set) {
    const resultItem = mapper(item)
    if (isPromise(resultItem)) {
      promises.push(resultItem.then(curry2(setAdd, result, __)))
    } else {
      result.add(resultItem)
    }
  }
  return promises.length == 0
    ? result
    : promiseAll(promises).then(always(result))
}

/**
 * @name then
 *
 * @synopsis
 * then(value any, func value=>(result any)) -> result
 */
const then = (value, func) => isPromise(value) ? value.then(func) : func(value)

/**
 * @name promiseObjectAll
 *
 * @synopsis
 * promiseObjectAll(object<Promise|any>) -> Promise<object>
 */
const promiseObjectAll = object => new Promise(function (resolve) {
  const result = {}
  let numPromises = 0
  for (const key in object) {
    const value = object[key]
    if (isPromise(value)) {
      numPromises += 1
      value.then((key => function (res) {
        result[key] = res
        numPromises -= 1
        if (numPromises == 0) resolve(result)
      })(key))
    } else {
      result[key] = value
    }
  }
  if (numPromises == 0) resolve(result)
})

/**
 * @name possiblePromiseThen
 *
 * @synopsis
 * possiblePromiseThen(value Promise|any, func function) -> Promise|any
 */
const possiblePromiseThen = (value, func) => (
  isPromise(value) ? value.then(func) : func(value))

/**
 * @name SyncThenable
 *
 * @synopsis
 * new SyncThenable(value any) -> SyncThenable
 */
const SyncThenable = function (value) { this.value = value }

/**
 * @name SyncThenable.prototype.then
 *
 * @synopsis
 * new SyncThenable(value any).then(func function) -> any
 */
SyncThenable.prototype.then = function (func) { return func(this.value) }

/**
 * @name possiblePromiseAll
 *
 * @synopsis
 * possiblePromiseAll(
 *   values Array<Promise>|Array,
 * ) -> Promise<Array>|SyncThenable<Array>
 */
const possiblePromiseAll = values => (values.some(isPromise)
  ? promiseAll(values)
  : new SyncThenable(values))

/**
 * @name funcConcat
 *
 * @synopsis
 * any -> A, any -> B, any -> C
 *
 * funcConcat(
 *   funcA (args ...any)=>(intermediate any),
 *   funcB intermediate=>(result any)
 * ) -> pipedFunction ...args=>result
 */
const funcConcat = (
  funcA, funcB,
) => function pipedFunction(...args) {
  const intermediate = funcA(...args)
  return isPromise(intermediate)
    ? intermediate.then(funcB)
    : funcB(intermediate)
}

/**
 * @name funcConcatSync
 *
 * @synopsis
 * funcConcatSync(funcA function, funcB function) -> pipedFunction function
const funcConcatSync = (
  funcA, funcB,
) => function pipedFunction(...args) {
  return funcB(funcA(...args))
} */

/**
 * @name pipe
 *
 * @catchphrase
 * define flow: chain functions together
 *
 * @synopsis
 * any -> T
 *
 * (any, T)=>Promise|any -> Reducer<T>
 *
 * Reducer=>Reducer -> Transducer
 *
 * pipe([
 *   args=>Promise|any,
 *   ...Array<any=>Promise|any>,
 * ])(args ...any) -> Promise|any
 *
 * pipe(
 *   Array<Transducer>,
 * )(Reducer) -> composed Reducer
 *
 * @description
 * **pipe** takes an array of functions and chains them together, each function passing its return value to the next function until all functions have been called. The final output for a given pipe is the output of the last function in the pipe.
 *
 * ```javascript-playground
 * console.log(
 *   pipe([
 *     number => number + 1,
 *     number => number + 2,
 *     number => number + 3,
 *   ])(5),
 * ) // 11
 * ```
 *
 * When the first argument supplied to a pipe of functions is a non-generator function, **pipe** assumes it is being used in transducer position and iterates through its functions in reverse. This is due to an implementation detail in transducers, and enables the library transducer API.
 *
 * ```
 * any -> T
 *
 * (any, T)=>Promise|any -> Reducer<T> // the standalone <T> means "generic of T"
 *
 * Reducer=>Reducer -> Transducer
 * ```
 *
 * A reducer is a function that takes a generic of any type T, a given instance of type T, and returns possibly a Promise of a generic of type T. A transducer is a function that takes a reducer and returns another reducer.
 *
 * ```
 * pipe(
 *   Array<Transducer>,
 * )(Reducer) -> composed Reducer
 * ```
 *
 * **pipe** supports transducer composition. When passed a reducer function, a pipe of functions returns a new reducer function that applies the transducers of the functions array in series, ending the chain with the passed in reducer. `compositeReducer` must be used in transducer position in conjunction with **reduce** or any implementation of reduce to have a transducing effect. For more information on this behavior, see [transducers](https://github.com/a-synchronous/rubico/blob/master/TRANSDUCERS.md).
 *
 * ```javascript-playground
 * const isOdd = number => number % 2 == 1
 *
 * const square = number => number ** 2
 *
 * const add = (a, b) => a + b
 *
 * const squaredOdds = pipe([
 *   filter(isOdd),
 *   map(square),
 * ])
 *
 * console.log(
 *   [1, 2, 3, 4, 5].reduce(squaredOdds(add), 0),
 * ) // 1 + 9 + 25 -> 35
 *
 * console.log(
 *   squaredOdds([1, 2, 3, 4, 5])
 * ) // [1, 9, 25]
 * ```
 *
 * @execution series
 *
 * @transducing
 */
const pipe = function (funcs) {
  const functionPipeline = funcs.reduce(funcConcat),
    functionComposition = funcs.reduceRight(funcConcat)
  return function pipeline(...args) {
    const firstArg = args[0]
    if (
      typeof firstArg == 'function'
        && !isGeneratorFunction(firstArg)
        && !isAsyncGeneratorFunction(firstArg)
    ) {
      return functionComposition(...args)
    }
    return functionPipeline(...args)
  }
}

/**
 * @name funcObjectAll
 *
 * @synopsis
 * funcObjectAll(
 *   funcs Object<args=>Promise|any>
 * )(args ...any) -> objectAllFuncs args=>Promise|Object
 */
const funcObjectAll = funcs => function objectAllFuncs(...args) {
  const result = {}
  let isAsync = false
  for (const key in funcs) {
    const resultItem = funcs[key](...args)
    if (isPromise(resultItem)) isAsync = true
    result[key] = resultItem
  }
  return isAsync ? promiseObjectAll(result) : result
}

/**
 * @name funcAll
 *
 * @synopsis
 * ...any -> args
 *
 * funcAll(
 *   funcs Array<args=>Promise|any>
 * ) -> allFuncs args=>Promise|Array
 */
const funcAll = funcs => function allFuncs(...args) {
  const funcsLength = funcs.length,
    result = Array(funcsLength)
  let funcsIndex = -1, isAsync = false
  while (++funcsIndex < funcsLength) {
    const resultItem = funcs[funcsIndex](...args)
    if (isPromise(resultItem)) isAsync = true
    result[funcsIndex] = resultItem
  }
  return isAsync ? promiseAll(result) : result
}

/**
 * @name fork
 *
 * @catchphrase
 * duplicate and diverge flow
 *
 * @synopsis
 * fork(
 *   funcs Object<args=>Promise|any>,
 * )(args ...any) -> Promise|Object
 *
 * fork(
 *   funcs Array<args=>Promise|any>,
 * )(args ...any) -> Promise|Array
 *
 * @description
 * **fork** takes an array or object of optionally async functions and an input value and returns an array or object or Promise of either. The resulting array or object is the product of applying each function in the array or object of functions to any amount of input arguments.
 *
 * All functions of `funcs`, including additional forks, are executed concurrently.
 *
 * ```javascript-playground
 * console.log(
 *   fork({
 *     greetings: fork([
 *       greeting => greeting + 'world',
 *       greeting => greeting + 'mom',
 *     ]),
 *   })('hello'),
 * ) // { greetings: ['hello world', 'hello mom'] }
 * ```
 *
 * @execution concurrent
 */
const fork = funcs => isArray(funcs) ? funcAll(funcs) : funcObjectAll(funcs)

/**
 * @name asyncFuncAllSeries
 *
 * @synopsis
 * asyncFuncAllSeries(
 *   funcs Array<function>,
 *   args Array,
 *   result Array,
 *   funcsIndex number,
 * ) -> result
 *
 * @TODO benchmark vs regular promise handling
 */
const asyncFuncAllSeries = async function (funcs, args, result, funcsIndex) {
  const funcsLength = funcs.length
  while (++funcsIndex < funcsLength) {
    result[funcsIndex] = await funcs[funcsIndex](...args)
  }
  return result
}

/**
 * @name funcAllSeries
 *
 * @synopsis
 * ...any -> args
 *
 * funcAllSeries(
 *   funcs Array<args=>any>,
 * ) -> allFuncsSeries args=>Promise|Array
 *
 * @TODO .then quickscope
 */
const funcAllSeries = funcs => function allFuncsSeries(...args) {
  const funcsLength = funcs.length, result = []
  let funcsIndex = -1
  while (++funcsIndex < funcsLength) {
    const resultItem = funcs[funcsIndex](...args)
    if (isPromise(resultItem)) {
      return resultItem.then(res => {
        result[funcsIndex] = res
        return asyncFuncAllSeries(funcs, args, result, funcsIndex)
      })
    }
    result[funcsIndex] = resultItem
  }
  return result
}

/**
 * @name fork.series
 *
 * @catchphrase
 * fork in series
 *
 * @synopsis
 * fork.series(
 *   funcs Array<args=>Promise|any>,
 * )(args ...any) -> Promise|Array
 *
 * @description
 * **fork.series** is fork with serial execution instead of concurrent execution of functions. All functions of `funcs` are then executed in series.
 *
 * ```javascript-playground
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

/**
 * @name assign
 *
 * @catchphrase
 * fork, then merge results
 *
 * @synopsis
 * assign(
 *   funcs Object<object=>Promise|any>,
 * )(object Object) -> result Promise|Object
 *
 * @description
 * **assign** accepts an object of optionally async functions and an object input and returns an object or a Promise of an object. The result is composed of the original input and an object computed from a concurrent evaluation of the object of functions with the input. `result` is each function of `funcs` applied with Object `object` merged into the input Object `object`. If any functions of `funcs` is asynchronous, `result` is a Promise.
 *
 * All functions of `funcs`, including additional forks, are executed concurrently.
 *
 * ```javascript-playground
 * console.log(
 *   assign({
 *     squared: ({ number }) => number ** 2,
 *     cubed: ({ number }) => number ** 3,
 *   })({ number: 3 }),
 * ) // { number: 3, squared: 9, cubed: 27 }
 * ```
 *
 * @execution concurrent
 *
 * @TODO .then quickscope
 */
const assign = function (funcs) {
  const allFuncs = funcObjectAll(funcs)
  return function assignment(object) {
    const result = allFuncs(object)
    return isPromise(result)
      ? result.then(res => ({ ...object, ...res }))
      : ({ ...object, ...result })
  }
}

/**
 * @name tap
 *
 * @catchphrase
 * spy on flow
 *
 * @synopsis
 * tap(function)(value any) -> Promise|value
 *
 * @description
 * **tap** accepts a function and any value, calls the function with the value, and returns the original value. This is useful for running side effects in function pipelines, e.g. logging out data in a pipeline to the console.
 *
 * ```javascript-playground
 * pipe([
 *   tap(console.log),
 *   value => value + 'bar'
 *   tap(console.log),
 * ])('foo') // 'foo'
 *           // 'foobar'
 * ```
 */
const tap = func => function tapping(...args) {
  const point = args[0],
    call = func(...args)
  return isPromise(call) ? call.then(always(point)) : point
}

/**
 * @name tapSync
 *
 * @synopsis
 * tapSync(function)(args ...any) -> args[0]
 */
const tapSync = func => function tapping(...args) {
  func(...args)
  return args[0]
}

tap.sync = tapSync

/**
 * @name tap.if
 *
 * @catchphrase
 * conditional tap
 *
 * @synopsis
 * tap.if(
 *   cond value=>boolean,
 *   func value=>Promise|any,
 * )(value any) -> value
 *
 * @description
 * **tap.if** takes a condition `cond`, a function `func`, and an input `value`, returning the `result` as the unchanged `value`. If `cond` applied with `value` is falsy, `func` is not called; otherwise, `func` is called with `value`. `result` is a Promise if either `func` or `cond` is asynchronous.
 *
 * ```javascript-playground
 * const isOdd = number => number % 2 == 1
 *
 * pipe([
 *   tap.if(isOdd, number => {
 *     console.log('odd', number)
 *   }),
 *   number => number ** 2,
 *   tap.if(isOdd, number => {
 *     console.log('squared odd', number)
 *   }),
 * ])(3) // odd 3
 *       // squared odd 9
 * ```
 *
 * @TODO
 */
tap.if = (cond, func) => {}

/**
 * @name catcherApply
 *
 * @synopsis
 * catcherApply(
 *   catcher function,
 *   err Error|any,
 *   args Array,
 * ) -> catcher(err, ...args)
 */
const catcherApply = function (catcher, err, args) {
  return catcher(err, ...args)
}

/**
 * @name tryCatch
 *
 * @catchphrase
 * try a function, catch with another
 *
 * @synopsis
 * tryCatch(
 *   tryer args=>Promise|any,
 *   catcher (err Error|any, ...args)=>Promise|any,
 * )(args ...any) -> Promise|any
 *
 * @description
 * **tryCatch** takes two functions, a tryer and a catcher, and returns a tryCatcher function that, when called, calls the tryer with the arguments. If the tryer throws an Error or returns a Promise that rejects, tryCatch calls the catcher with the thrown value and the arguments. If the tryer called with the arguments does not throw, the tryCatcher returns the result of that call.
 *
 * ```javascript-playground
 * const errorThrower = tryCatch(
 *   message => {
 *     throw new Error(message)
 *   },
 *   (err, message) => {
 *     console.log(err)
 *     return `${message} from catcher`
 *   },
 * )
 *
 * console.log(errorThrower('hello')) // Error: hello
 *                                    // hello from catcher
 * ```
 *
 * @TODO offload result.catch to its own function
 */
const tryCatch = (tryer, catcher) => function tryCatcher(...args) {
  try {
    const result = tryer(...args)
    return isPromise(result)
      ? result.catch(curry3(catcherApply, catcher, __, args))
      : result
  } catch (err) {
    return catcher(err, ...args)
  }
}

/**
 * @name asyncFuncSwitch
 *
 * @synopsis
 * asyncFuncSwitch(
 *   funcs Array<args=>Promise|any>,
 *   args Array,
 *   funcsIndex number,
 * ) -> Promise|any
 *
 * @TODO isPromise conditional await
 * @TODO benchmark vs regular promise handling
 */
const asyncFuncSwitch = async function (funcs, args, funcsIndex) {
  const lastIndex = funcs.length - 1
  while ((funcsIndex += 2) < lastIndex) {
    if (await funcs[funcsIndex](...args)) {
      return funcs[funcsIndex + 1](...args)
    }
  }
  return funcs[funcsIndex](...args)
}

/**
 * @name thunkConditional
 *
 * @synopsis
 * thunkConditional(
 *   boolean,
 *   thunkA ()=>any,
 *   thunkB ()=>any,
 * ) -> any
 */
const thunkConditional = (
  boolean, thunkA, thunkB,
) => boolean ? thunkA() : thunkB()

/**
 * @name funcApply
 *
 * @synopsis
 * funcApply(func function, args Array) -> func(...args)
 */
const funcApply = (func, args) => func(...args)

/**
 * @name funcSwitch
 *
 * @synopsis
 * funcSwitch(
 *   funcs Array<args=>Promise|any>,
 * )(args ...any) -> Promise|any
 */
const funcSwitch = funcs => function funcSwitching(...args) {
  const lastIndex = funcs.length - 1
  let funcsIndex = -2

  while ((funcsIndex += 2) < lastIndex) {
    const shouldReturnNext = funcs[funcsIndex](...args)
    if (isPromise(shouldReturnNext)) {
      return shouldReturnNext.then(curry3(
        thunkConditional,
        __,
        thunkify1(curry2(funcApply, funcs[funcsIndex + 1], __), args),
        thunkify3(asyncFuncSwitch, funcs, args, funcsIndex)))
    }
    if (shouldReturnNext) {
      return funcs[funcsIndex + 1](...args)
    }
  }
  return funcs[funcsIndex](...args)
}

/**
 * @name switchCase
 *
 * @synopsis
 * switchCase(funcs)
 *
 * switchCase(switchers Array<function>)(args ...any) -> Promise|any
 */
const switchCase = funcSwitch

/**
 * @name arrayMap
 *
 * @synopsis
 * any -> A, any -> B
 *
 * arrayMap(array Array<A>, mapper A=>Promise|B) -> Promise|Array<B>
 */
const arrayMap = function (array, mapper) {
  const arrayLength = array.length,
    result = Array(arrayLength)
  let index = -1,
    isAsync = false

  while (++index < arrayLength) {
    const resultItem = mapper(array[index])
    if (isPromise(resultItem)) {
      isAsync = true
    }
    result[index] = resultItem
  }
  return isAsync ? promiseAll(result) : result
}

/**
 * @name objectMap
 *
 * @synopsis
 * objectMap(
 *   object Object, mapper function,
 * ) -> Promise|Object
 */
const objectMap = function (object, mapper) {
  const result = {}
  let isAsync = false

  for (const key in object) {
    const resultItem = mapper(object[key])
    if (isPromise(resultItem)) isAsync = true
    result[key] = resultItem
  }
  return isAsync ? promiseObjectAll(result) : result
}

/**
 * @name generatorFunctionMap
 *
 * @synopsis
 * any -> A, any -> B
 *
 * generatorFunctionMap(
 *   generatorFunc GeneratorFunction<A>,
 *   mapper A=>B,
 * ) -> GeneratorFunction<B>
 */
const generatorFunctionMap = function (generatorFunc, mapper) {
  return function* mappingGeneratorFunc(...args) {
    for (const item of generatorFunc(...args)) {
      yield mapper(item)
    }
  }
}

/**
 * @name MappingIterator
 *
 * @synopsis
 * const mappingIterator = new MappingIterator(
 *   iter Iterator, mapper function,
 * ) -> MappingIterator
 *
 * mappingIterator.next() -> { value: any, done: boolean }
 */
const MappingIterator = function (iter, mapper) {
  this.iter = iter
  this.mapper = mapper
}

MappingIterator.prototype = {
  [symbolIterator]() {
    return this
  },
  next() {
    const iteration = this.iter.next()
    return iteration.done
      ? iteration
      : { value: this.mapper(iteration.value), done: false }
  },
}

/**
 * @name asyncGeneratorFunctionMap
 *
 * @synopsis
 * any -> A, any -> B
 *
 * asyncGeneratorFunctionMap(
 *   asyncGeneratorFunc AsyncGeneratorFunction<A>,
 *   mapper A=>Promise|B,
 * ) -> AsyncGeneratorFunction<B>
 */
const asyncGeneratorFunctionMap = function (asyncGeneratorFunc, mapper) {
  return async function* mappingAsyncGeneratorFunc(...args) {
    for await (const item of asyncGeneratorFunc(...args)) {
      yield mapper(item)
    }
  }
}

/**
 * @name toIteration
 *
 * @synopsis
 * toIteration(value any) -> { value, done: false }
 */
const toIteration = value => ({ value, done: false })

/**
 * @name MappingAsyncIterator
 *
 * @synopsis
 * mappingAsyncIterator = new MappingAsyncIterator(
 *   iter AsyncIterator,
 *   mapper function,
 * ) -> MappingAsyncIterator
 *
 * mappingAsyncIterator.next() -> Promise<{ value: any, done: boolean }>
 */
const MappingAsyncIterator = function (iter, mapper) {
  this.iter = iter
  this.mapper = mapper
}

MappingAsyncIterator.prototype = {
  [symbolAsyncIterator]() {
    return this
  },
  async next() {
    const iteration = await this.iter.next()
    if (iteration.done) {
      return iteration
    }

    const mapped = this.mapper(iteration.value)
    return isPromise(mapped)
      ? mapped.then(toIteration)
      : { value: mapped, done: false }
  }
}

/**
 * @name reducerMap
 *
 * @synopsis
 * any -> A, any -> B
 *
 * reducerMap(
 *   reducer (any, A)=>any,
 *   mapper A=>B,
 * ) -> mappingReducer (any, B)=>any
 */
const reducerMap = (reducer, mapper) => function mappingReducer(result, value) {
  const mapped = mapper(value)
  return isPromise(mapped)
    ? mapped.then(curry2(reducer, result, __))
    : reducer(result, mapped)
}

/**
 * @name map
 *
 * @catchphrase
 * linearly transform data
 *
 * @synopsis
 * map(
 *   mapper function,
 * )(value any) -> result any
 *
 * Functor<T> = Array<T>|Object<T>
 *   |Iterator<T>|AsyncIterator<T>
 *   |{ map: (T=>any)=>this }
 *
 * map(
 *   mapper any=>Promise|any,
 * )(Functor|any) -> Promise|Functor|any
 *
 * map(
 *   mapper (item any)=>any,
 * )(...any=>Iterator<item>) -> ...any=>Iterator<mapper(item)>
 *
 * map(
 *   mapper (item any)=>Promise|any,
 * )(...any=>AsyncIterator<item>) -> ...any=>AsyncIterator<mapper(item)>
 *
 * Reducer<T> = (any, T)=>Promise|any
 *
 * map(
 *   mapper item=>Promise|any,
 * )(Reducer<item>) -> Reducer<mapper(item)>
 *
 * @description
 * **map** takes an [a]synchronous mapper function and applies it to each item of a functor, returning a functor of the same type with all resulting items. Since multiple vanilla JavaScript types can be considered functors, `map` is polymorphic and predefines the required `map` operation for values of the following types:
 *
 *  * `Array`
 *  * `Object` - just the values are iterated
 *  * `Iterator` or `Generator`
 *  * `AsyncIterator` or `AsyncGenerator`
 *  * `{ map: (T=>any)=>this }` - an object that implements map
 *
 * If the first value supplied to a mapping function is not one of the above, the result of the mapping operation is a direct application of the mapper function to the first value. This defines behavior for any type supplied to a mapping function - a mapping function created with `map` will not throw unless the error originates from the mapper.
 *
 * If the input functor has an implicit order, e.g. an Array, the resulting functor will have the same order. If the input collection does not have an implicit order, the order of the result is not guaranteed.
 *
 * ```javascript-playground
 * const square = number => number ** 2
 *
 * console.log(
 *   map(square)([1, 2, 3, 4, 5]),
 * ) // [1, 4, 9, 16, 25]
 *
 * console.log(
 *   map(square)({ a: 1, b: 2, c: 3 }),
 * ) // { a: 1, b: 4, c: 9 }
 * ```
 *
 * In general, a mapping function will always return a result that is the same type as the first provided argument. Each of the following function types, when passed as the first value to a mapping function, create a function of the same type with all items of the return value transformed by the mapper.
 *
 *  * `...any=>Iterator` or `GeneratorFunction` - items of the iterator are mapped into a new iterator. Warning: using an async mapper in a synchronous generator function is not recommended and could lead to unexpected behavior.
 *  * `...any=>AsyncIterator` or `AsyncGeneratorFunction` - items of the async iterator are mapped into a new async iterator. Async result items are awaited in a new async iterator. Async mapper functions are okay here.
 *  * `Reducer<T> = (any, T)=>Promise|any` - when combined with `reduce` or any implementation thereof, items of the reducing operation are transformed by the mapper function. If an async mapper function is desired here, it is possible with rubico `reduce`.
 *
 * With mapping generator functions and mapping async generator functions, transformations on iterators and their async counterparts are simple to compose.
 *
 * ```javascript-playground
 * const capitalize = string => string.toUpperCase()
 *
 * const abc = function* () {
 *   yield 'a'; yield 'b'; yield 'c'
 * }
 *
 * const ABC = map(capitalize)(abc)
 *
 * const abcIter = abc()
 *
 * const ABCIter = map(capitalize)(abcIter)
 *
 * console.log([...ABC()]) // ['A', 'B', 'C']
 *
 * console.log([...ABCIter]) // ['A', 'B', 'C']
 * ```
 *
 * The above concept is extended to reducer functions as [transducers](https://github.com/a-synchronous/rubico/blob/master/TRANSDUCERS.md).
 *
 * ```
 * any -> T
 *
 * (any, T)=>Promise|any -> Reducer<T>
 *
 * Reducer=>Reducer -> Transducer
 * ```
 *
 * A **reducer** is a variadic function like the one supplied to `Array.prototype.reduce`, but without the index and reference to the accumulated result per call. A **transducer** is a function that accepts a reducer function as an argument and returns another reducer function, which enables chaining functionality at the reducer level. `map` is core to this mechanism, and provides a seamless way to create transducers with mapper functions.
 *
 * ```javascript-playground
 * const square = number => number ** 2
 *
 * const concat = (array, item) => array.concat(item)
 *
 * const mapSquare = map(square)
 * // mapSquare could potentially be a transducer, but at this point, it is
 * // undifferentiated and not necessarily locked in to transducer behavior.
 * // For example, mapSquare([1, 2, 3, 4, 5]) would produce [1, 9, 25]
 *
 * const squareConcatReducer = mapSquare(concat)
 * // now mapSquare is passed the function concat, so it assumes transducer
 * // position. squareConcatReducer is a reducer with chained functionality -
 * // square and concat.
 *
 * console.log(
 *   [1, 2, 3, 4, 5].reduce(squareConcatReducer, []),
 * ) // [1, 4, 9, 16, 25]
 * ```
 *
 * @execution concurrent
 *
 * @transducing
 *
 * TODO streamMap
 */
const map = mapper => function mapping(value) {
  if (isArray(value)) {
    return arrayMap(value, mapper)
  }
  if (isFunction(value)) {
    if (isGeneratorFunction(value)) {
      return generatorFunctionMap(value, mapper)
    }
    if (isAsyncGeneratorFunction(value)) {
      return asyncGeneratorFunctionMap(value, mapper)
    }
    return reducerMap(value, mapper)
  }
  if (value == null) {
    return value
  }

  if (typeof value.next == 'function') {
    return symbolIterator in value
      ? new MappingIterator(value, mapper)
      : new MappingAsyncIterator(value, mapper)
  }
  if (value.constructor == Object) {
    return objectMap(value, mapper)
  }
  return typeof value.map == 'function' ? value.map(mapper) : mapper(value)
}

/**
 * @name asyncArrayMapSeries
 *
 * @synopsis
 * asyncArrayMapSeries(
 *   array Array,
 *   mapper function,
 *   result Array,
 *   index number,
 * ) -> result
 */
const asyncArrayMapSeries = async function (array, mapper, result, index) {
  const arrayLength = array.length
  while (++index < arrayLength) {
    result[index] = await mapper(array[index])
  }
  return result
}

/**
 * @name setProperty
 *
 * @synopsis
 * setProperty(
 *   object Object,
 *   property string,
 *   value any,
 * ) -> object
 */
const setProperty = function (object, property, value) {
  object[property] = value
  return object
}

/**
 * @name arrayMapSeries
 *
 * @synopsis
 * any -> A, any -> B
 *
 * arrayMapSeries(array Array<A>, mapper A=>B) -> result Array<B>
 *
 * @TODO .then quickscope
 */
const arrayMapSeries = function (array, mapper) {
  const arrayLength = array.length,
    result = Array(arrayLength)
  let index = -1

  while (++index < arrayLength) {
    const resultItem = mapper(array[index])
    if (isPromise(resultItem)) {
      return resultItem.then(funcConcat(
        curry3(setProperty, result, index, __),
        curry4(asyncArrayMapSeries, array, mapper, __, index)))
    }
    result[index] = resultItem
  }
  return result
}

/**
 * @name map.series
 *
 * @catchphrase
 * map in series
 *
 * @synopsis
 * any -> A; any -> B
 *
 * map.series(mapper A=>Promise|B)(Array<A>) -> Promise|Array<B>
 *
 * @description
 * **map.series** is **map** but with serial instead of concurrent application of the mapping function to each item of the input value.
 *
 * ```javascript-playground
 * const delayedLog = x => new Promise(function (resolve) {
 *   setTimeout(function () {
 *     console.log(x)
 *     resolve()
 *   }, 1000)
 * })
 *
 * console.log('start')
 * map.series(delayedLog)([1, 2, 3, 4, 5])
 * ```
 *
 * @execution series
 */
map.series = mapper => function serialMapping(value) {
  if (isArray(value)) {
    return arrayMapSeries(value, mapper)
  }
  throw new TypeError(`${value} is not an Array`)
}

/**
 * @name asyncArrayMapPool
 *
 * @synopsis
 * asyncArrayMapPool(
 *   array Array<A>,
 *   mapper A=>B,
 *   concurrencyLimit number,
 *   result Array<B>,
 *   index number,
 *   promises Set<Promise>,
 * ) -> result
 */
const asyncArrayMapPool = async function (
  array, mapper, concurrencyLimit, result, index, promises,
) {
  const arrayLength = array.length

  while (++index < arrayLength) {
    if (promises.size >= concurrencyLimit) {
      await promiseRace(promises)
    }
    const resultItem = mapper(array[index])
    if (isPromise(resultItem)) {
      const selfDeletingPromise = resultItem.then(
        tapSync(() => promises.delete(selfDeletingPromise)))
      promises.add(selfDeletingPromise)
      result[index] = selfDeletingPromise
    } else {
      result[index] = resultItem
    }
  }
  return promiseAll(result)
}

/**
 * @name
 * arrayMapPool
 *
 * @synopsis
 * any -> A; any -> B
 *
 * arrayMapPool(
 *   array Array<A>,
 *   mapper A=>B,
 *   concurrentLimit number,
 * ) -> result Promise|Array<B>
 */
const arrayMapPool = function (array, mapper, concurrentLimit) {
  const arrayLength = array.length,
    result = Array(arrayLength)
  let index = -1

  while (++index < arrayLength) {
    const resultItem = mapper(array[index])
    if (isPromise(resultItem)) {
      const promises = new Set(),
        selfDeletingPromise = resultItem.then(
          tapSync(() => promises.delete(selfDeletingPromise)))
      promises.add(selfDeletingPromise)
      result[index] = selfDeletingPromise
      return asyncArrayMapPool(
        array, mapper, concurrentLimit, result, index, promises)
    }
    result[index] = resultItem
  }
  return result
}

/**
 * @name map.pool
 *
 * @catchphrase
 * map with concurrent limit
 *
 * @synopsis
 * any -> A; any -> B
 *
 * map.pool(
 *   concurrentLimit number,
 *   mapper A=>B,
 * )(value Array<A>) -> Promise|Array<B>
 *
 * @description
 * **map.pool** is **map** with a concurrency limit that specifies the maximum number of promises in flight in a given moment for an asynchronous mapping operation.
 *
 * ```javascript-playground
 * const delayedLog = x => new Promise(function (resolve) {
 *   setTimeout(function () {
 *     console.log(x)
 *     resolve()
 *   }, 1000)
 * })
 *
 * console.log('start')
 * map.pool(2, delayedLog)([1, 2, 3, 4, 5])
 * ```
 *
 * @execution concurrent
 */
map.pool = (concurrencyLimit, mapper) => function concurrentPoolMapping(value) {
  if (isArray(value)) {
    return arrayMapPool(value, mapper, concurrencyLimit)
  }
  throw new TypeError(`${value} is not an Array`)
}

/**
 * @name arrayMapWithIndex
 *
 * @synopsis
 * any -> A; any -> B
 *
 * arrayMapWithIndex(
 *   array Array<A>,
 *   mapper (A, index number, array Array<A>)=>Promise|B
 * ) -> Promise|Array<B>
 */
const arrayMapWithIndex = function (array, mapper) {
  const arrayLength = array.length,
    result = Array(arrayLength)
  let index = -1, isAsync = false

  while (++index < arrayLength) {
    const resultItem = mapper(array[index], index, array)
    if (isPromise(resultItem)) {
      isAsync = true
    }
    result[index] = resultItem
  }
  return isAsync ? promiseAll(result) : result
}

/**
 * @name map.withIndex
 *
 * @catchphrase
 * map with index
 *
 * @synopsis
 * any -> A; any -> B
 *
 * map.withIndex(
 *   mapper (A, index number, Array<A>)=>Promise|B,
 * )(Array<A>) -> Promise|Array<B>
 *
 * @description
 *
 * @execution concurrent
 */
map.withIndex = mapper => function mappingWithIndex(value) {
  if (isArray(value)) {
    return arrayMapWithIndex(value, mapper)
  }
  throw new TypeError(`${value} is not an Array`)
}

/**
 * @name map.own
 *
const Person = function (name) {
  this.name = name
}

Person.prototype.greet = function () {
  console.log(`Hello, my name is ${this.name}`)
}

const david = new Person('david')

david.greet() // Hello, my name is david

david.a = 1
david.b = 2
david.c = 3

const square = number => number ** 2

const nativeHasOwnProperty = Object.prototype.hasOwnProperty

const objectHasOwnProperty = (object, property) => nativeHasOwnProperty.call(object, property)

map.own = mapper => function mappingOwnProperties(object) {
  const result = {}
  for (const key in object) {
    if (objectHasOwnProperty(object, key)) {
      result[key] = mapper(object[key]) // TODO promise support
    }
  }
  return result
}

console.log(
  map.own(square)(david),
) // { name: NaN, a: 1, b: 4, c: 9 }
 *
 *
 */

/**
 * @name arrayFilterByConditions
 *
 * @synopsis
 * arrayFilterByConditions(
 *   array Array,
 *   result Array,
 *   index number,
 *   conditions Array<boolean>,
 * ) -> result
 */
const arrayFilterByConditions = function (
  array, result, index, conditions,
) {
  const arrayLength = array.length,
    resultPush = result.push.bind(result)
  let conditionsIndex = -1

  while (++index < arrayLength) {
    if (conditions[++conditionsIndex]) {
      resultPush(array[index])
    }
  }
  return result
}

/**
 * @name arrayFilter
 *
 * @synopsis
 * any -> T
 *
 * arrayFilter(
 *   array Array<T>,
 *   predicate T=>Promise|boolean,
 * ) -> result Promise|Array<T>
 */
const arrayFilter = function (array, predicate) {
  const arrayLength = array.length,
    result = []
  let index = -1,
    resultIndex = -1

  while (++index < arrayLength) {
    const item = array[index]
    const shouldIncludeItem = predicate(item)
    if (isPromise(shouldIncludeItem)) {
      return promiseAll(
        arrayExtendMap(
          [shouldIncludeItem], array, predicate, index)).then(
            curry4(arrayFilterByConditions, array, result, index - 1, __))
    }
    if (shouldIncludeItem) {
      result[++resultIndex] = item
    }
  }
  return result
}

/**
 * @name transferPropertyByCondition
 *
 * @synopsis
 * transferPropertyByCondition(
 *   objectA object,
 *   objectB object,
 *   key string,
 *   condition boolean,
 * ) -> ()
 */
const transferPropertyByCondition = function (
  target, source, key, condition,
) {
  if (condition) {
    target[key] = source[key]
  }
}

/**
 * @name objectFilter
 *
 * @synopsis
 * any -> T
 *
 * objectFilter(
 *   object Object<T>,
 *   predicate T=>boolean,
 * ) -> result Object<T>
 */
const objectFilter = function (object, predicate) {
  const result = {},
    promises = []

  for (const key in object) {
    const item = object[key]
    const shouldIncludeItem = predicate(item)
    if (isPromise(shouldIncludeItem)) {
      promises.push(shouldIncludeItem.then(
        curry4(transferPropertyByCondition, result, object, key, __)))
    } else if (shouldIncludeItem) {
      result[key] = item
    }
  }
  return promises.length == 0
    ? result
    : promiseAll(promises).then(always(result))
}

/**
 * @name generatorFunctionFilter
 *
 * @synopsis
 * any -> T
 *
 * (args ...any)=>Generator<T> -> GeneratorFunction<args, T>
 *
 * generatorFunctionFilter(
 *   generatorFunction GeneratorFunction<args, T>
 *   predicate T=>boolean,
 * ) -> filteringGeneratorFunction GeneratorFunction<args, T>
 */
const generatorFunctionFilter = function (generatorFunction, predicate) {
  return function* filteringGeneratorFunction(...args) {
    for (const item of generatorFunction(...args)) {
      if (predicate(item)) {
        yield item
      }
    }
  }
}

/**
 * @name FilteringIterator
 *
 * @synopsis
 * any -> T
 *
 * filteringIterator = new FilteringIterator(
 *   iter Iterator<T>,
 *   predicate T=>boolean,
 * )
 *
 * filteringIterator.next() -> { value: any, done: boolean }
 */
const FilteringIterator = function (iter, predicate) {
  this.iter = iter
  this.predicate = predicate
}

FilteringIterator.prototype = {
  [symbolIterator]() {
    return this
  },
  next() {
    const thisIterNext = this.iter.next.bind(this.iter),
      thisPredicate = this.predicate
    let iteration = this.iter.next()

    while (!iteration.done) {
      const { value } = iteration
      if (thisPredicate(value)) {
        return { value, done: false }
      }
      iteration = thisIterNext()
    }
    return iteration
  },
}

/**
 * @name asyncGeneratorFunctionFilter
 *
 * @synopsis
 * any -> T
 *
 * (args ...any)=>AsyncGenerator<T> -> AsyncGeneratorFunction<args, T>
 *
 * asyncGeneratorFunctionFilter(
 *   asyncGeneratorFunction AsyncGeneratorFunction<args, T>,
 *   predicate T=>boolean,
 * ) -> filteringAsyncGeneratorFunction AsyncGeneratorFunction<args, T>
 */
const asyncGeneratorFunctionFilter = function (asyncGeneratorFunction, predicate) {
  return async function* filteringAsyncGeneratorFunction(...args) {
    for await (const item of asyncGeneratorFunction(...args)) {
      const shouldIncludeItem = predicate(item)
      if (
        isPromise(shouldIncludeItem)
          ? await shouldIncludeItem
          : shouldIncludeItem
      ) {
        yield item
      }
    }
  }
}

/**
 * @name FilteringAsyncIterator
 *
 * @synopsis
 * any -> T
 *
 * const filteringAsyncIterator = new FilteringAsyncIterator(
 *   iter AsyncIterator<T>,
 *   predicate T=>boolean,
 * ) -> FilteringAsyncIterator<T>
 *
 * filteringAsyncIterator.next() -> { value: Promise, done: boolean }
 */
const FilteringAsyncIterator = function (iter, predicate) {
  this.iter = iter
  this.predicate = predicate
}

FilteringAsyncIterator.prototype = {
  [symbolAsyncIterator]() {
    return this
  },
  async next() {
    const thisIterNext = this.iter.next.bind(this.iter),
      thisPredicate = this.predicate
    let iteration = await thisIterNext()

    while (!iteration.done) {
      const { value } = iteration
      const shouldIncludeItem = thisPredicate(value)
      if (
        isPromise(shouldIncludeItem)
          ? await shouldIncludeItem
          : shouldIncludeItem
      ) {
        return { value, done: false }
      }
      iteration = await thisIterNext()
    }
    return iteration
  },
}

/**
 * @name reducerFilterByCondition
 *
 * @synopsis
 * T = any
 *
 * reducerFilterByCondition(
 *   reducer (any, T)=>Promise|any,
 *   result any,
 *   item T,
 *   condition boolean,
 * ) -> any
 */
const reducerFilterByCondition = (
  reducer, result, item, condition,
) => condition ? reducer(result, item) : result

/**
 * @name reducerFilter
 *
 * @synopsis
 * any -> T
 *
 * reducerFilter(
 *   reducer (any, T)=>Promise|any,
 *   predicate T=>Promise|boolean,
 * ) -> filteringReducer (result any, item T)=>Promise|any
 */
const reducerFilter = (
  reducer, predicate,
) => function filteringReducer(result, item) {
  const shouldInclude = predicate(item)
  return isPromise(shouldInclude)
    ? shouldInclude.then(
      curry4(reducerFilterByCondition, reducer, result, item, __))
    : shouldInclude ? reducer(result, item) : result
}

/**
 * @name filter
 *
 * @catchphrase
 * exclude data by predicate
 *
 * @synopsis
 * any -> T
 *
 * (any, T)=>Promise|any -> Reducer<T>
 *
 * { filter: (T=>boolean)=>this<T> } -> Filterable<T>
 *
 * filter(predicate T=>Promise|boolean)(
 *   value Array<T>,
 * ) -> Promise|Array<T>
 *
 * filter(predicate T=>Promise|boolean)(
 *   value Object<T>,
 * ) -> Promise|Object<T>
 *
 * filter(predicate T=>boolean)(
 *   value GeneratorFunction<(args ...any)=>Generator<T>>,
 * ) -> GeneratorFunction<args=>Generator<T>>
 *
 * filter(predicate T=>boolean)(
 *   value Iterator<T>,
 * ) -> Iterator<T>
 *
 * filter(predicate T=>Promise|boolean)(
 *   AsyncGeneratorFunction<(args ...any)=>AsyncGenerator<T>>
 * ) -> AsyncGeneratorFunction<args=>AsyncGenerator<T>>
 *
 * filter(predicate T=>Promise|boolean)(
 *   value AsyncIterator<T>,
 * ) -> AsyncIterator<T>
 *
 * filter(predicate T=>Promise|boolean)(
 *   value Reducer<T>,
 * ) -> Reducer<T>
 *
 * filter(predicate T=>boolean)(
 *   value Filterable<T>,
 * ) -> Filterable<T>
 *
 * filter(predicate T=>Promise|boolean)(
 *   value T,
 * ) -> Promise|T
 *
 * @description
 * **filter** accepts a predicate function and a value of any type and returns the same type with elements excluded by the provided predicate function.
 *
 * ```javascript-playground
 * const isOdd = number => number % 2 == 1
 *
 * console.log(
 *   filter(isOdd)([1, 2, 3, 4, 5]),
 * ) // [1, 3, 5]
 *
 * console.log(
 *   filter(isOdd)({ a: 1, b: 2, c: 3, d: 4, e: 5 }),
 * ) // { a: 1, c: 3, e: 5 }
 * ```
 *
 * `filter` filters arrays and objects. Arrays are filtered by supplying a given item of the array to the predicate function and only including the item if the evaluation is truthy. For objects, `filter` iterates over all keys, including those inherited from the prototype. Objects are filtered by supplying the value associated with a given key to the predicate.
 *
 * When filtering on arrays and objects, the predicate supplied to `filter` can be asynchronous.
 *
 * ```javascript-playground
 * const isOdd = number => number % 2 == 1
 *
 * const numbers = function* () {
 *   yield 1; yield 2; yield 3; yield 4; yield 5
 * }
 *
 * const oddNumbers = filter(isOdd)(numbers)
 *
 * for (const number of oddNumbers()) {
 *   console.log(number) // 1
 *                       // 3
 *                       // 5
 * }
 *
 * const oddNumbersGenerator = filter(isOdd)(numbers())
 *
 * for (const number of oddNumbersGenerator) {
 *   console.log(number) // 1
 *                       // 3
 *                       // 5
 * }
 * ```
 *
 * Passing a generator function to `filter` returns a filtering generator function; all values that are normally yielded by a generator function that test falsy with the predicate are skipped by the returned filtering generator function. Passing any iterator, including a generator, to `filter` returns a filtering iterator; all `.next` calls with values that test falsy with the predicate are skipped by the returned filtering iterator.
 *
 * **Warning**: usage of an async predicate with generator functions or iterators may lead to undesirable behavior.
 *
 * ```javascript-playground
 * const asyncIsOdd = async number => number % 2 == 1
 *
 * const asyncNumbers = async function* () {
 *   yield 1; yield 2; yield 3; yield 4; yield 5
 * }
 *
 * const asyncOddNumbers = filter(asyncIsOdd)(asyncNumbers)
 *
 * for await (const number of asyncOddNumbers()) {
 *   console.log(number) // 1
 *                       // 3
 *                       // 5
 * }
 *
 * const asyncOddNumbersGenerator = filter(asyncIsOdd)(asyncNumbers())
 *
 * for await (const number of asyncOddNumbersGenerator) {
 *   console.log(number) // 1
 *                       // 3
 *                       // 5
 * }
 * ```
 *
 * In a similar vein to iterators and generator functions, `filter` filters elements from async generator functions and async iterators. All elements normally yielded by an async generator function that test falsy with the predicate are skipped by a filtering async generator function. All values normally returned by an async iterator's `.next` that test falsy under the predicate are also skipped by a filtering async iterator.
 *
 * The predicate can be asynchronous when filtering async iterators or async generator functions.
 *
 * ```javascript-playground
 * const isOdd = number => number % 2 == 1
 *
 * const concat = (array, item) => array.concat(item)
 *
 * const concatOddNumbers = filter(isOdd)(concat)
 *
 * console.log(
 *   [1, 2, 3, 4, 5].reduce(concatOddNumbers, []),
 * ) // [1, 3, 5]
 * ```
 *
 * Finally, `filter` returns a filtering reducer when acting on a reducer. A filtering reducer skips items of a reducing operation if they test falsy under the predicate. In the example above, the filtering reducer `concatOddNumbers` only concatenates the odd numbers of `[1, 2, 3, 4, 5]` onto the result array by testing them against the predicate `isOdd`.
 *
 * It is possible to use an asynchronous predicate when filtering a reducer, however the implementation of `reduce` must support asynchronous operations. rubico provides such an implementation as `reduce`.
 *
 * @execution concurrent
 *
 * @transducing
 */
const filter = predicate => function filtering(value) {
  if (isArray(value)) {
    return arrayFilter(value, predicate)
  }
  if (isFunction(value)) {
    if (isGeneratorFunction(value)) {
      return generatorFunctionFilter(value, predicate)
    }
    if (isAsyncGeneratorFunction(value)) {
      return asyncGeneratorFunctionFilter(value, predicate)
    }
    return reducerFilter(value, predicate)
  }
  if (value == null) {
    return value
  }

  if (typeof value.next == 'function') {
    return symbolIterator in value
      ? new FilteringIterator(value, predicate)
      : new FilteringAsyncIterator(value, predicate)
  }
  if (value.constructor == Object) {
    return objectFilter(value, predicate)
  }
  return typeof value.filter == 'function' ? value.filter(predicate) : value
}

/**
 * @name arrayExtendMapWithIndex
 *
 * @catchphrase
 * internal extend while mapping with index
 *
 * @synopsis
 * arrayExtendMapWithIndex(
 *   array Array<B>,
 *   values Array<A>,
 *   valuesMapper (A, valuesIndex number, values)=>B,
 *   valuesIndex number,
 * ) -> array
 */
const arrayExtendMapWithIndex = function (
  array, values, valuesMapper, valuesIndex,
) {
  const valuesLength = values.length
  let arrayIndex = array.length - 1

  while (++valuesIndex < valuesLength) {
    array[++arrayIndex] = valuesMapper(
      values[valuesIndex], valuesIndex, values)
  }
  return array
}

/**
 * @name arrayFilterWithIndex
 *
 * @synopsis
 * any -> T
 *
 * arrayFilterWithIndex(
 *   array Array<T>,
 *   predicate (T, index number, array)=>Promise|boolean,
 * ) -> result Promise|Array<T>
 */
const arrayFilterWithIndex = function (array, predicate) {
  const arrayLength = array.length,
    result = []
  let index = -1,
    resultIndex = -1

  while (++index < arrayLength) {
    const item = array[index]
    const shouldIncludeItem = predicate(item, index, array)
    if (isPromise(shouldIncludeItem)) {
      return promiseAll(
        arrayExtendMapWithIndex(
          [shouldIncludeItem], array, predicate, index)).then(
            curry4(arrayFilterByConditions, array, result, index - 1, __))
    }
    if (shouldIncludeItem) {
      result[++resultIndex] = item
    }
  }
  return result
}

/**
 * @name filter.withIndex
 *
 * @catchphrase
 * filter with index
 *
 * @synopsis
 * any -> T
 *
 * filter.withIndex(predicate T=>Promise|boolean)(
 *   value Array<T>,
 * ) -> Array<T>
 *
 * @description
 * **filter.withIndex** is `filter` but every call of the predicate is supplemented with the additional index and reference to the array being filtered.
 *
 * @execution concurrent
 */
filter.withIndex = predicate => function filteringWithIndex(value) {
  if (isArray(value)) {
    return arrayFilterWithIndex(value, predicate)
  }
  throw new TypeError(`${value} is not an Array`)
}

/**
 * @name asyncArrayReduce
 *
 * @synopsis
 * asyncArrayReduce(
 *   array Array,
 *   reducer function,
 *   result any,
 *   index number,
 * ) -> result
 */
const asyncArrayReduce = async function (array, reducer, result, index) {
  const arrayLength = array.length
  while (++index < arrayLength) {
    result = await reducer(result, array[index])
  }
  return result
}

/**
 * @name arrayReduce
 *
 * @synopsis
 * any -> T
 *
 * arrayReduce(
 *   array Array<T>,
 *   reducer (any, T)=>Promise|any,
 *   result any,
 * ) -> result
 */
const arrayReduce = function (array, reducer, result) {
  const arrayLength = array.length
  let index = -1
  if (result === undefined) {
    result = array[++index]
  }

  while (++index < arrayLength) {
    result = reducer(result, array[index])
    if (isPromise(result)) {
      return result.then(
        curry4(asyncArrayReduce, array, reducer, __, index))
    }
  }
  return result
}

/**
 * @name asyncIteratorReduce
 *
 * @synopsis
 * any -> T
 *
 * asyncIteratorReduce(
 *   asyncIterator AsyncIterator<T>,
 *   reducer (any, T)=>Promise|any,
 *   result any,
 * ) -> result any
 */
const asyncIteratorReduce = async function (asyncIterator, reducer, result) {
  let iteration = await asyncIterator.next()
  if (iteration.done) {
    return result
  }
  if (result === undefined) {
    result = iteration.value
    iteration = await asyncIterator.next()
  }

  while (!iteration.done) {
    result = await reducer(result, iteration.value)
    iteration = await asyncIterator.next()
  }
  return result
}

/**
 * @name asyncGeneratorFunctionReduce
 *
 * @synopsis
 * any -> T
 *
 * asyncGeneratorFunctionReduce(
 *   asyncGeneratorFunc ...args=>AsyncGenerator<T>,
 *   reducer (any, T)=>any,
 *   result any,
 * ) -> (...any args)=>any
 */
const asyncGeneratorFunctionReduce = (
  asyncGeneratorFunc, reducer, result,
) => funcConcat(
  asyncGeneratorFunc,
  curry3(asyncIteratorReduce, __, reducer, result))

/**
 * @name iteratorReduce
 *
 * @synopsis
 * any -> T
 *
 * iteratorReduce(
 *   iterator Iterator<T>,
 *   reducer (any, T)=>Promise|any,
 *   result any,
 * ) -> result
 */
const iteratorReduce = function (iterator, reducer, result) {
  let iteration = iterator.next()
  if (iteration.done) {
    return result
  }
  if (result === undefined) {
    result = iteration.value
    iteration = iterator.next()
  }

  while (!iteration.done) {
    result = reducer(result, iteration.value)
    if (isPromise(result)) {
      return result.then(curry3(asyncIteratorReduce, iterator, reducer, __))
    }
    iteration = iterator.next()
  }
  return result
}

/**
 * @name generatorFunctionReduce
 *
 * @synopsis
 * any -> T
 *
 * generatorFunctionReduce(
 *   generatorFunc ...args=>AsyncGenerator<T>,
 *   reducer (any, T)=>Promise|any,
 *   result any,
 * ) -> (...any args)=>any
 */
const generatorFunctionReduce = (
  generatorFunc, reducer, result,
) => funcConcat(
  generatorFunc,
  curry3(iteratorReduce, __, reducer, result))

/**
 * @name reducerConcat
 *
 * @synopsis
 * any -> T
 *
 * reducerConcat(
 *   reducerA (any, T)=>(intermediate Promise|any),
 *   reducerB (intermediate, T)=>Promise|any,
 * ) -> pipedReducer (any, T)=>Promise|any
 */
const reducerConcat = function (reducerA, reducerB) {
  return function pipedReducer(result, item) {
    const intermediate = reducerA(result, item)
    return isPromise(intermediate)
      ? intermediate.then(curry2(reducerB, __, item))
      : reducerB(intermediate, item)
  }
}

/**
 * @name reducerConcatSync
 *
 * @synopsis
 * any -> T
 *
 * reducerConcatSync(
 *   reducerA (any, T)=>(intermediate any),
 *   reducerB (intermediate, T)=>any,
 * ) -> pipedReducer (any, T)=>any
const reducerConcatSync = (
  reducerA, reducerB,
) => function pipedReducer(result, item) {
  return reducerB(reducerA(result, item), item)
} */

/**
 * @name tacitGenericReduce
 *
 * @synopsis
 * any -> T
 *
 * tacitGenericReduce(
 *   reducer (any, T)=>any,
 *   result any,
 * ) -> reducing ...any=>result
 */
const tacitGenericReduce = (
  reducer, result,
) => function reducing(...args) {
  return genericReduce(args, reducer, result)
}

/**
 * @name genericReduce
 *
 * @synopsis
 * any -> T
 *
 * (any, T)=>any -> Reducer<T>
 *
 * genericReduce(
 *   args [collection <T>, ...any],
 *   reducer (any, T)=>any,
 *   result undefined|any,
 * ) -> result
 *
 * @related genericReduceConcurrent
 *
 * @TODO genericReduceSync(args, reducer, init) - performance optimization for some of these genericReduces that we know are synchronous
 *
 * @TODO genericReducePool(poolSize, args, reducer, init) - for some of these genericReduces that we want to race - result should not care about order of concatenations
 * reduce.pool
 * transform.pool
 * flatMap.pool
 */
var genericReduce = function (args, reducer, result) {
  const collection = args[0]
  if (isArray(collection)) {
    return arrayReduce(collection, reducer, result)
  }
  if (collection == null) {
    return result === undefined
      ? reducer(collection)
      : reducer(result, collection)
  }

  if (typeof collection.next == 'function') {
    return symbolIterator in collection
      ? iteratorReduce(collection, reducer, result)
      : asyncIteratorReduce(collection, reducer, result)
  }
  if (typeof collection[symbolIterator] == 'function') {
    return iteratorReduce(
      collection[symbolIterator](), reducer, result)
  }
  if (typeof collection[symbolAsyncIterator] == 'function') {
    return asyncIteratorReduce(
      collection[symbolAsyncIterator](), reducer, result)
  }
  if (isFunction(collection)) {
    if (isGeneratorFunction(collection)) {
      return generatorFunctionReduce(collection, reducer, result)
    }
    if (isAsyncGeneratorFunction(collection)) {
      return asyncGeneratorFunctionReduce(collection, reducer, result)
    }
    return tacitGenericReduce(
      args.length == 0 ? reducer : args.reduce(reducerConcat, reducer),
      result)
  }
  if (typeof collection.reduce == 'function') {
    return collection.reduce(reducer, result)
  }
  if (typeof collection.chain == 'function') {
    return collection.chain(curry2(reducer, result, __))
  }
  if (typeof collection.flatMap == 'function') {
    return collection.flatMap(curry2(reducer, result, __))
  }
  if (collection.constructor == Object) {
    return arrayReduce(objectValues(collection), reducer, result)
  }
  return result === undefined
    ? reducer(collection)
    : reducer(result, collection)
}

/**
 * @name reduce
 *
 * @catchphrase
 * execute data transformation by reducer
 *
 * @synopsis TODO - redo like this
 * ```coffeescript [specscript]
 * Monad = { chain: function }
 *
 * FlatMappable = { flatMap: function }
 *
 * Writable = { write: function }
 *
 * Semigroup = Array|String|Set
 *   |TypedArray|Writable
 *   |{ concat: function }|Object
 *
 * Foldable = Iterable|Iterator
 *   |AsyncIterable|AsyncIterator
 *   |{ reduce: function }|Object
 *
 * flatMap(
 *   flatMapper item=>Foldable|Monad|FlatMappable|any,
 * )(value Semigroup<item any>) -> result Semigroup
 *
 * Reducer<T> = (any, T)=>Promise|any
 *
 * flatMap(
 *   flatMapper item=>Foldable|Monad|FlatMappable|any,
 * )(value Reducer<item>) -> flatMappingReducer Reducer
 * ```
 *
 * @synopsis
 * reduce(
 *   reducer function,
 *   init undefined|function|any,
 * )(...any) -> Promise|any
 *
 * Reducer<T> (any, T)=>Promise|any
 *
 * reduce(
 *   reducer Reducer,
 *   init undefined
 *     |((collection, ...restArgs)=>Promise|any)
 *     |any,
 * )(
 *   collection Iterable|Iterator
 *     |AsyncIterable|AsyncIterator
 *     |{ reduce: function }|Object|any,
 *   restArgs ...any
 * ) -> Promise|any
 *
 * reduce(
 *   reducer Reducer,
 *   init undefined
 *     |(...args=>Promise|any)
 *     |any,
 * )(
 *   generatorFunction (...args=>Generator)|(...args=>AsyncGenerator),
 * ) -> reducingFunction (args ...any)=>Promise|any
 *
 * reduce(
 *   reducer Reducer,
 *   init undefined
 *     |(...args=>Promise|any)
 *     |any,
 * )(
 *   anotherReducer Reducer, moreReducers ...Reducer
 * ) -> chainedReducingFunction (args ...any)=>Promise|any
 *
 * @description
 * **reduce** constructs a reducing function that executes a data transformation defined by a reducer function and an optional init value. When called with a collection, a given reducing function applies its reducer function in series to an accumulator with initial value `init` and each item of the collection, returning the result of calling the reducer with the accumulator and the last item of the collection.
 *
 * ```javascript-playground
 * const add = (a, b) => a + b
 *
 * console.log(
 *   reduce(add, 0)([1, 2, 3, 4, 5]),
 * ) // 15
 * ```
 *
 * If `init` is undefined, the first item of the input collection is used as the initial value for the accumulator.
 *
 * ```javascript-playground
 * const max = (a, b) => a > b ? a : b
 *
 * console.log(
 *   reduce(max)([1, 3, 5, 4, 2]),
 * ) // 5
 * ```
 *
 * If `init` is a function, it is treated as a resolver and called with the input arguments to resolve an initial value for the accumulator. Unless care is exercised when handling references for this initial value, a function `init` is the recommended way to use reduce for transformations on non-primitive initial values.
 *
 * ```javascript-playground
 * const concatSquares = (array, value) => array.concat(value ** 2)
 *
 * const initEmptyArray = () => []
 *
 * console.log(
 *   reduce(concatSquares, initEmptyArray)([1, 2, 3, 4, 5]),
 * ) // [1, 4, 9, 16, 25]
 * ```
 *
 * `reduce` elevates the concept of transformation beyond synchronous operations on arrays. The `reducer` function can be asynchronous, while the input value can be an asynchronous stream.
 *
 * ```javascript-playground
 * const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
 *
 * // asyncAppReducer(
 * //   state { todos: Array },
 * //   action { type: string, todoID: string },
 * // ) -> state
 * const asyncAppReducer = async function (state, action) {
 *   if (action.type == 'FETCH_TODO') {
 *     const todo = await fetch(
 *       'https://jsonplaceholder.typicode.com/todos/' + action.todoID,
 *     ).then(response => response.json())
 *     console.log('fetched', todo)
 *     state.todos.push(todo)
 *     return state
 *   }
 *   return state
 * }
 *
 * const asyncFetchActions = async function* (count) {
 *   let idCount = 0
 *   while (++idCount <= count) {
 *     await sleep(1000)
 *     yield { type: 'FETCH_TODO', todoID: idCount }
 *   }
 * }
 *
 * const state = { todos: [] }
 *
 * reduce(asyncAppReducer, state)(asyncFetchActions(5)).then(
 *   reducedState => console.log('finalState', reducedState))
 *
 * // fetched { userId: 1, id: 1, title: 'delectus aut autem', completed: false }
 * // fetched { userId: 1, id: 2, title: 'quis ut nam facilis...', completed: false }
 * // fetched { userId: 1, id: 3, title: 'fugiat veniam minus', completed: false }
 * // fetched { userId: 1, id: 4, title: 'et porro tempora', completed: true }
 * // fetched { userId: 1, id: 5, title: 'laboriosam mollitia...', completed: false }
 * // finalState {
 * //   todos: [
 * //     { userId: 1, id: 1, title: 'delectus aut autem', completed: false },
 * //     { userId: 1, id: 2, title: 'quis ut nam facilis...', completed: false },
 * //     { userId: 1, id: 3, title: 'fugiat veniam minus', completed: false },
 * //     { userId: 1, id: 4, title: 'et porro tempora', completed: true },
 * //     { userId: 1, id: 5, title: 'laboriosam mollitia...', completed: false },
 * //   ],
 * // }
 * ```
 *
 * rubico's async capable [transducers](https://github.com/a-synchronous/rubico/blob/master/TRANSDUCERS.md) API is useful for chaining operations on items of large or even infinite streams of data. A combination with async capable `reduce` enables a compositional refactor of `asyncAppReducer` above.
 *
 * ```javascript-playground
 * const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
 *
 * const isActionTypeFetchTodo = action => action.type == 'FETCH_TODO'
 *
 * const fetchTodoByAction = action => fetch(
 *   'https://jsonplaceholder.typicode.com/todos/' + action.todoID,
 * ).then(response => response.json())
 *
 * const stateAddTodo = function (state, todo) {
 *   state.todos.push(todo)
 *   return state
 * }
 *
 * // asyncAppReducer(
 * //   state { todos: Array },
 * //   action { type: string, todoID: string },
 * // ) -> state
 * const asyncAppReducer = pipe([
 *   filter(isActionTypeFetchTodo),
 *   map(fetchTodoByAction),
 *   map(tap(function (todo) {
 *     console.log('fetched', todo)
 *   })),
 * ])(stateAddTodo)
 *
 * const asyncFetchActions = async function* (count) {
 *   let idCount = 0
 *   while (++idCount <= count) {
 *     await sleep(1000)
 *     yield { type: 'FETCH_TODO', todoID: idCount }
 *   }
 * }
 *
 * const state = { todos: [] }
 *
 * reduce(asyncAppReducer, state)(asyncFetchActions(5)).then(
 *   reducedState => console.log('finalState', reducedState))
 * ```
 *
 * If the first argument to a reducing function is a reducer, `reduce` concatenates any reducers in argument position onto the initial reducer, producing a combined reducer that performs a chained operation per each item in a reducing operation. For more reducer combinators, see rubico's Reducer monad.
 *
 * ```javascript-playground
 * const reducerA = (state, action) => {
 *   if (action.type == 'A') return { ...state, A: true }
 *   return state
 * }
 *
 * const reducerB = (state, action) => {
 *   if (action.type == 'B') return { ...state, B: true }
 *   return state
 * }
 *
 * const reducerC = (state, action) => {
 *   if (action.type == 'C') return { ...state, C: true }
 *   return state
 * }
 *
 * const emptyReducer = result => result
 *
 * const reducingABC = reduce(
 *   emptyReducer, () => ({}),
 * )(reducerA, reducerB, reducerC)
 *
 * const actions = [{ type: 'A' }, { type: 'B' }, { type: 'C' }]
 *
 * console.log(
 *   reducingABC(actions),
 * ) // { A: true, B: true, C: true }
 * ```
 *
 * @execution series
 *
 * @transducing
 *
 * @TODO readerReduce
 *
 * @TODO reduce.concurrent
 */
const reduce = function (reducer, init) {
  if (isFunction(init)) {
    return function reducing(...args) {
      const result = init(...args)
      return isPromise(result)
        ? result.then(curry3(genericReduce, args, reducer, __))
        : genericReduce(args, reducer, result)
    }
  }
  return tacitGenericReduce(reducer, init)
}

/**
 * @name emptyTransform
 *
 * @synopsis
 * Reducer<T> = (any, T)=>any
 *
 * Transducer = Reducer=>Reducer
 *
 * emptyTransform(
 *   args Array,
 *   transducer Transducer,
 *   result any,
 * ) -> result
 */
const emptyTransform = function (args, transducer, result) {
  const nil = genericReduce(args, transducer(identity), null)
  return isPromise(nil) ? nil.then(always(result)) : result
}

/**
 * @name _binaryExtend
 *
 * @synopsis
 * _binaryExtend(
 *   typedArray TypedArray,
 *   array Array|TypedArray,
 * ) -> concatenatedTypedArray
 */
const _binaryExtend = function (typedArray, array) {
  const offset = typedArray.length
  const result = new typedArray.constructor(offset + array.length)
  result.set(typedArray)
  result.set(array, offset)
  return result
}

/**
 * @name binaryExtend
 *
 * @synopsis
 * binaryExtend(
 *   typedArray TypedArray,
 *   array Array|TypedArray|any,
 * ) -> concatenatedTypedArray
 */
const binaryExtend = function (typedArray, array) {
  if (isArray(array) || isBinary(array)) {
    return _binaryExtend(typedArray, array)
  }
  return _binaryExtend(typedArray, [array])
}

/**
 * @name streamAppender
 *
 * @synopsis
 * streamAppender(stream Writable) -> appender (
 *   chunk string|Buffer|Uint8Array|any,
 *   encoding string|undefined,
 *   callback function|undefined,
 * )=>stream
 */
const streamAppender = stream => function appender(
  chunk, encoding, callback,
) {
  stream.write(chunk, encoding, callback)
  return stream
}

/**
 * @name streamExtendExecutor
 *
 * @synopsis
 * streamExtendExecutor(
 *   resultStream Writable, stream Readable,
 * ) -> executor (resolve function, reject function)=>()
 *
 * @note optimizes function creation within streamExtend
 */
const streamExtendExecutor = (
  resultStream, stream,
) => function executor(resolve, reject) {
  stream.on('data', streamAppender(resultStream))
  stream.on('end', thunkify1(resolve, resultStream))
  stream.on('error', reject)
}

/**
 * @name _streamExtend
 *
 * @synopsis
 * _streamExtend(
 *   resultStream Writable, stream Readable,
 * ) -> writableStream
 */
const _streamExtend = (
  resultStream, stream,
) => new Promise(streamExtendExecutor(resultStream, stream))

/**
 * @name streamExtend
 *
 * @synopsis
 * Writable = { write: function }
 *
 * Readable = { pipe: function }
 *
 * streamExtend(
 *   stream Writable,
 *   values Readable|any,
 * ) -> stream
 *
 * @note support `.read` maybe
 */
const streamExtend = function (stream, values) {
  if (isNodeReadStream(values)) {
    return _streamExtend(stream, values)
  }
  stream.write(values)
  return stream
}

/**
 * @name callConcat
 *
 * @synopsis
 * callConcat(object Object, values any) -> object
 */
const callConcat = function (object, values) {
  return object.concat(values)
}

/**
 * @name genericTransform
 *
 * @synopsis
 * Reducer<T> = (any, T)=>any
 *
 * Transducer = Reducer=>Reducer
 *
 * Semigroup = Array|string|Set|TypedArray
 *   |{ concat: function }|{ write: function }|Object
 *
 * genericTransform(
 *   args Array,
 *   transducer Transducer,
 *   result Semigroup|any,
 * ) -> result
 */
const genericTransform = function (args, transducer, result) {
  if (isArray(result)) {
    return genericReduce(args, transducer(arrayExtend), result)
  }
  if (isBinary(result)) {
    const intermediateArray = genericReduce(args, transducer(arrayExtend), [])
    return isPromise(intermediateArray)
      ? intermediateArray.then(curry2(_binaryExtend, result, __))
      : _binaryExtend(result, intermediateArray)
  }
  if (result == null) {
    return emptyTransform(args, transducer, result)
  }

  const resultConstructor = result.constructor
  if (typeof result == 'string' || resultConstructor == String) {
    return genericReduce(args, transducer(add), result)
  }
  if (typeof result.concat == 'function') {
    return genericReduce(args, transducer(callConcat), result)
  }
  if (typeof result.write == 'function') {
    return genericReduce(args, transducer(streamExtend), result)
  }
  if (resultConstructor == Set) {
    return genericReduce(args, transducer(setExtend), result)
  }
  if (resultConstructor == Object) {
    return genericReduce(args, transducer(objectAssign), result)
  }
  return emptyTransform(args, transducer, result)
}

/**
 * @name transform
 *
 * @catchphrase
 * execute data transformation by transducer + concatenation
 *
 * @synopsis
 * transform(
 *   transducer function,
 *   init function|any,
 * )(...any) -> Promise|any
 *
 * Reducer<T> = (any, T)=>Promise|any
 *
 * Transducer = Reducer=>Reducer
 *
 * TODO explore Semigroup = Iterator|AsyncIterator
 *
 * Semigroup = Array|string|Set|TypedArray
 *   |{ concat: function }|{ write: function }|Object
 *
 * transform(
 *   transducer Transducer,
 *   init ((collection, ...restArgs)=>Promise|Semigroup|any)
 *     |Semigroup
 *     |any,
 * )(
 *   collection Iterable|Iterator
 *     |AsyncIterable|AsyncIterator
 *     |{ reduce: function }|Object|any,
 *   restArgs ...any
 * ) -> Semigroup Promise|any
 *
 * transform(
 *   transducer Transducer,
 *   init (...args=>Promise|Semigroup|any)
 *     |Semigroup
 *     |any,
 * )(
 *   generatorFunction (...args=>Generator)|(...args=>AsyncGenerator),
 * ) -> reducingFunction (args ...any)=>Promise|Semigroup|any
 *
 * transform(
 *   transducer Transducer,
 *   init (...args=>Promise|Semigroup|any)
 *     |Semigroup
 *     |any,
 * )(
 *   anotherReducer Reducer, moreReducers ...Reducer
 * ) -> chainedReducingFunction (args ...any)=>Promise|any
 *
 * @description
 * Before reading further, make sure to have a decent understanding of [transducers](https://github.com/a-synchronous/rubico/blob/master/TRANSDUCERS.md).
 *
 * **transform** executes a reducing operation defined by a transducer, initial value or resolver of value, and a concatenation operation `.concat` specific to the type of the resolved initial value.
 *
 * ```javascript-playground
 * const square = number => number ** 2
 *
 * const isOdd = number => number % 2 == 1
 *
 * const squaredOdds = pipe([
 *   filter(isOdd),
 *   map(square),
 * ])
 *
 * console.log(
 *   transform(squaredOdds, () => [])([1, 2, 3, 4, 5]),
 * ) // [1, 9, 25]
 *
 * console.log(
 *   transform(squaredOdds, '')([1, 2, 3, 4, 5]),
 * ) // '1925'
 *
 * console.log(
 *   transform(squaredOdds, () => new Uint8Array())([1, 2, 3, 4, 5]),
 * ) // Uint8Array(3) [ 1, 9, 25 ]
 * ```
 *
 * `transform` is effectively `reduce` paired with a transduced reducer with a type specific `.concat` operation for merging pipeline items into the aggregate result. `transform` is a specialized application of `reduce` towards transformations between domains. For example, the above `squaredOdds` transducer is capable of transforming an array of numbers to another array, a string, or a slice of bytes based on the initial value of the accumulator.
 *
 * The full spectrum of types that `transform` recognizes as domains is defined by the `Semigroup` type and category. If concatenation makes sense for objects of a certain type, it could be considered a `Semigroup` ([fantasyland spec](https://github.com/fantasyland/fantasy-land#semigroup)).
 *
 * rubico defines several built-in types as part of `Semigroup`, including ones that do not necessarily implement `.concat` but where concatenation is sensible. For example, `transform` can operate on instances of `TypedArray` even when they do not officially implement `.concat`. This happens via a library algorithm that manages the size of the buffer.
 *
 * ```
 * Semigroup = Array|string|Set|TypedArray
 *   |{ concat: function }|{ write: function }|Object
 * ```
 *
 * Concatenation varies by aggregate result and pipeline item. Generally, if an item is of the same type as the aggregate result, it is flattened into the result. Otherwise, the item is appended.
 *
 *  * `Array` - concatenation resembles `result.concat(item)`. Non-arrays are concatenated as items, while arrays are flattened.
 *  * `string` - concatenation is `result + item`
 *  * `Set` - concatenation resembles `result.add(item)` for individual items; other sets are flattened.
 *  * `TypedArray` - concatenation is managing ArrayBuffers while appending items. Careful about the types here - a `Uint8Array` should only concatenate 8-bit unsigned numbers if not concatenating other `Uint8Array`s
 *  * { concat: function } - an object that implements concat. Concatenation calls the `.concat` method in `result.concat(item)`. Flattening is left to the implementation.
 *  * { write: function } - an object that implements write; these are for Node.js streams. Concatenation calls the method `.write` in `result.write(item)` or `item.pipe(result)` if the `item` is readable.
 *  * Object - a regular object, this could be state. Concatenation is a shallow merge `{ ...object, ...item }` or identity for null and undefined.
 *
 * When an object implements `.concat`, it can be transformed as a Semigroup. This is to be able to support transformations of any custom object that could be considered a semigroup.
 *
 * ```javascript-playground
 * const Max = function (number) {
 *   this.number = number
 * }
 *
 * Max.prototype.concat = function (otherMax) {
 *   return new Max(Math.max(
 *     this.number,
 *     otherMax.constructor == Max ? otherMax.number : otherMax,
 *   ))
 * }
 *
 * transform(
 *   map(Math.abs), new Max(-Infinity),
 * )([-1, -2, -3, -4, -5]) // Max { 5 }
 * ```
 *
 * With `transform`, it is possible to pipe together streams and async streams, e.g. Node.js Streams with async iterables. This is made possible by rubico's internal promise handling.
 *
 * ```javascript
 * // this example is duplicated in rubico/examples/transformStreamRandomInts.js
 *
 * const { pipe, map, transform } = require('rubico')
 *
 * const square = number => number ** 2
 *
 * const toString = value => value.toString()
 *
 * const randomInt = () => Math.ceil(Math.random() * 100)
 *
 * const streamRandomInts = async function* () {
 *   while (true) {
 *     yield randomInt()
 *   }
 * }
 *
 * transform(
 *   map(pipe([square, toString])), process.stdout,
 * )(streamRandomInts()) // 9216576529289484980147613249169774446246768649...
 * ```
 *
 * For an aggregate object, incoming items are assigned. This behavior combined with reducer combinators supports application state management with async reducers similar to `reduce`.
 *
 * ```javascript-playground
 * const reducerA = async (state, action) => {
 *   if (action.type == 'A') return { ...state, A: true }
 *   return state
 * }
 *
 * const reducerB = async (state, action) => {
 *   if (action.type == 'B') return { ...state, B: true }
 *   return state
 * }
 *
 * const reducerC = async (state, action) => {
 *   if (action.type == 'C') return { ...state, C: true }
 *   return state
 * }
 *
 * const logAction = function (action) {
 *   console.log('action', action)
 *   return action
 * }
 *
 * const reducingABC = transform(
 *   map(logAction), () => ({}),
 * )(reducerA, reducerB, reducerC)
 *
 * const actions = [{ type: 'A' }, { type: 'B' }, { type: 'C' }]
 *
 * reducingABC(actions).then(
 *   state => console.log('state', state)) // action { type: 'A' }
 *                                         // action { type: 'B' }
 *                                         // action { type: 'C' }
 *                                         // state { A: true, B: true, C: true }
 * ```
 *
 * @execution series
 *
 * @transducing
 */
const transform = function (transducer, init) {
  if (isFunction(init)) {
    return function reducing(...args) {
      const result = init(...args)
      return isPromise(result)
        ? result.then(curry3(genericTransform, args, transducer, __))
        : genericTransform(args, transducer, result)
    }
  }
  return function reducing(...args) {
    return genericTransform(args, transducer, init)
  }
}

/**
 * @name flatteningTransducer
 *
 * @synopsis
 * flatteningTransducer(concat Reducer) -> flatteningReducer Reducer
 *
 * DuplexStream = { read: function, write: function }
 *
 * Monad = Array|String|Set
 *   |TypedArray|DuplexStream|Iterator|AsyncIterator
 *   |{ chain: function }|{ flatMap: function }|Object
 *
 * Foldable = Iterable|AsyncIterable|{ reduce: function }
 *
 * FlatteningReducer<T> = (any, T)=>Promise|Monad|Foldable|any
 *
 * Reducer<T> = (any, T)=>Promise|any
 *
 * flatteningTransducer(concat Reducer) -> flatteningReducer FlatteningReducer
 *
 * @execution series
 */
const flatteningTransducer = concat => function flatteningReducer(
  result, item,
) {
  return genericReduce([item], concat, result)
}

/**
 * @name asyncIteratorForEach
 *
 * @synopsis
 * asyncIteratorForEach(asyncIterator AsyncIterable, callback function) -> ()
 */
const asyncIteratorForEach = async function (asyncIterator, callback) {
  for await (const item of asyncIterator) {
    callback(item)
  }
}

/**
 * @name arrayPush
 *
 * @synopsis
 * arrayPush(array, item) => array.push(item)
 */
const arrayPush = function (array, item) {
  array.push(item)
  return array
}

/**
 * @name monadArrayFlatten
 *
 * @synopsis
 * Monad = Array|String|Set
 *   |TypedArray|DuplexStream|Iterator|AsyncIterator
 *   |{ chain: function }|{ flatMap: function }|Object
 *
 * monadArrayFlatten(array Array<Monad|Foldable|any>) -> Array
 *
 * @related genericReduceConcurrent
 */
const monadArrayFlatten = function (array) {
  const length = array.length,
    promises = [],
    result = [],
    resultPushReducer = (_, subItem) => result.push(subItem),
    resultPush = curry2(arrayPush, result, __),
    getResult = () => result
  let index = -1

  while (++index < length) {
    const item = array[index]
    if (isArray(item)) {
      const itemLength = item.length
      let itemIndex = -1
      while (++itemIndex < itemLength) {
        result.push(item[itemIndex])
      }
    } else if (item == null) {
      result.push(item)
    } else if (typeof item[symbolIterator] == 'function') {
      for (const subItem of item) {
        result.push(subItem)
      }
    } else if (typeof item[symbolAsyncIterator] == 'function') {
      promises.push(
        asyncIteratorForEach(item[symbolAsyncIterator](), resultPush))
    } else if (typeof item.chain == 'function') {
      const monadValue = item.chain(identity)
      isPromise(monadValue)
        ? promises.push(monadValue.then(resultPush))
        : result.push(monadValue)
    } else if (typeof item.flatMap == 'function') {
      const monadValue = item.flatMap(identity)
      isPromise(monadValue)
        ? promises.push(monadValue.then(resultPush))
        : result.push(monadValue)
    } else if (typeof item.reduce == 'function') {
      const folded = item.reduce(resultPushReducer, null)
      isPromise(folded) && promises.push(folded)
    } else if (item.constructor == Object) {
      for (const key in item) {
        result.push(item[key])
      }
    } else {
      result.push(item)
    }
  }
  return promises.length == 0
    ? result
    : promiseAll(promises).then(getResult)
}

/**
 * @name arrayFlatMap
 *
 * @synopsis
 * DuplexStream = { read: function, write: function }
 *
 * Monad = Array|String|Set
 *   |TypedArray|DuplexStream|Iterator|AsyncIterator
 *   |{ chain: function }|{ flatMap: function }|Object
 *
 * Foldable = Iterable|AsyncIterable|{ reduce: function }
 *
 * arrayFlatMap(
 *   array Array,
 *   flatMapper item=>Promise|Monad|Foldable|any,
 * ) -> Array
 */
const arrayFlatMap = function (array, flatMapper) {
  const monadArray = arrayMap(array, flatMapper)
  return isPromise(monadArray)
    ? monadArray.then(monadArrayFlatten)
    : monadArrayFlatten(monadArray)
}

/**
 * @name monadObjectFlatten
 *
 * @synopsis
 * monadObjectFlatten(object Object) -> Object
 */
const monadObjectFlatten = function (object) {
  const promises = [],
    result = {},
    resultAssignReducer = (_, subItem) => objectAssign(result, subItem),
    resultAssign = curry2(objectAssign, result, __),
    getResult = () => result

  for (const key in object) {
    const item = object[key]
    if (item == null) {
      continue
    } else if (typeof item[symbolIterator] == 'function') {
      for (const monadItem of item) {
        objectAssign(result, monadItem)
      }
    } else if (typeof item[symbolAsyncIterator] == 'function') {
      promises.push(
        asyncIteratorForEach(item[symbolAsyncIterator](), resultAssign))
    } else if (typeof item.chain == 'function') {
      const monadValue = item.chain(identity)
      isPromise(monadValue)
        ? promises.push(monadValue.then(resultAssign))
        : objectAssign(result, monadValue)
    } else if (typeof item.flatMap == 'function') {
      const monadValue = item.flatMap(identity)
      isPromise(monadValue)
        ? promises.push(monadValue.then(resultAssign))
        : resultAssign(monadValue)
    } else if (typeof item.reduce == 'function') {
      const folded = item.reduce(resultAssignReducer, null)
      isPromise(folded) && promises.push(folded)
    } else {
      objectAssign(result, item)
    }
  }
  return promises.length == 0
    ? result
    : promiseAll(promises).then(getResult)
}

/**
 * @name objectFlatMap
 *
 * @synopsis
 * DuplexStream = { read: function, write: function }
 *
 * Monad = Array|String|Set
 *   |TypedArray|DuplexStream|Iterator|AsyncIterator
 *   |{ chain: function }|{ flatMap: function }|Object
 *
 * Foldable = Iterable|AsyncIterable|{ reduce: function }
 *
 * objectFlatMap(
 *   object Object,
 *   flatMapper item=>Promise|Monad|Foldable|any,
 * ) -> Object
 *
 * @related objectReduceConcurrent
 */
const objectFlatMap = function (object, flatMapper) {
  const monadObject = objectMap(object, flatMapper)
  return isPromise(monadObject)
    ? monadObject.then(monadObjectFlatten)
    : monadObjectFlatten(monadObject)
}

/**
 * @name monadSetFlatten
 *
 * @synopsis
 * monadSetFlatten(set Set<Monad|Foldable|any>) -> Set
 */
const monadSetFlatten = function (set) {
  const size = set.size,
    promises = [],
    result = new Set(),
    resultAddReducer = (_, subItem) => result.add(subItem),
    resultAdd = curry2(setAdd, result, __),
    getResult = () => result

  for (const item of set) {
    if (isArray(item)) {
      const itemLength = item.length
      let itemIndex = -1
      while (++itemIndex < itemLength) {
        result.add(item[itemIndex])
      }
    } else if (item == null) {
      result.add(item)
    } else if (typeof item[symbolIterator] == 'function') {
      for (const subItem of item) {
        result.add(subItem)
      }
    } else if (typeof item[symbolAsyncIterator] == 'function') {
      promises.push(
        asyncIteratorForEach(item[symbolAsyncIterator](), resultAdd))
    } else if (typeof item.chain == 'function') {
      const monadValue = item.chain(identity)
      isPromise(monadValue)
        ? promises.push(monadValue.then(resultAdd))
        : result.add(monadValue)
    } else if (typeof item.flatMap == 'function') {
      const monadValue = item.flatMap(identity)
      isPromise(monadValue)
        ? promises.push(monadValue.then(resultAdd))
        : result.add(monadValue)
    } else if (typeof item.reduce == 'function') {
      const folded = item.reduce(resultAddReducer, null)
      isPromise(folded) && promises.push(folded)
    } else if (item.constructor == Object) {
      for (const key in item) {
        result.add(item[key])
      }
    } else {
      result.add(item)
    }
  }
  return promises.length == 0
    ? result
    : promiseAll(promises).then(getResult)
}

/**
 * @name setFlatMap
 *
 * @synopsis
 * DuplexStream = { read: function, write: function }
 *
 * Monad = Array|String|Set
 *   |TypedArray|DuplexStream|Iterator|AsyncIterator
 *   |{ chain: function }|{ flatMap: function }|Object
 *
 * Foldable = Iterable|AsyncIterable|{ reduce: function }
 *
 * setFlatMap(
 *   set Set,
 *   flatMapper item=>Promise|Monad|Foldable|any,
 * ) -> Set
 */
const setFlatMap = function (set, flatMapper) {
  const monadSet = setMap(set, flatMapper)
  return isPromise(monadSet)
    ? monadSet.then(monadSetFlatten)
    : monadSetFlatten(monadSet)
}

/**
 * @name arrayJoin
 *
 * @synopsis
 * arrayJoin(array Array, delimiter string) -> string
 */
const arrayJoin = (array, delimiter) => array.join(delimiter)

/**
 * @name monadArrayFlattenToString
 *
 * @synopsis
 * monadArrayFlattenToString(
 *   array Array<Monad|Foldable|any>,
 * ) -> string
 */
const monadArrayFlattenToString = funcConcat(
  monadArrayFlatten, curry2(arrayJoin, __, ''))

/**
 * @name stringFlatMap
 *
 * @synopsis
 * DuplexStream = { read: function, write: function }
 *
 * Monad = Array|String|Set
 *   |TypedArray|DuplexStream|Iterator|AsyncIterator
 *   |{ chain: function }|{ flatMap: function }|Object
 *
 * Foldable = Iterable|AsyncIterable|{ reduce: function }
 *
 * stringFlatMap(
 *   string,
 *   flatMapper item=>Promise|Monad|Foldable|any,
 * ) -> string
 *
 * @related arrayFlatMap
 */
const stringFlatMap = function (string, flatMapper) {
  const monadArray = arrayMap(string, flatMapper)
  return isPromise(monadArray)
    ? monadArray.then(monadArrayFlattenToString)
    : monadArrayFlattenToString(monadArray)
}

/**
 * @name streamWrite
 *
 * @synopsis
 * streamWrite(
 *   stream Writable,
 *   chunk string|Buffer|Uint8Array|any,
 *   encoding string|undefined,
 *   callback function|undefined,
 * ) -> stream
 */
const streamWrite = function (stream, chunk, encoding, callback) {
  stream.write(chunk, encoding, callback)
  return stream
}

/**
 * @name streamFlatten
 *
 * @synopsis
 * Monad = Array|String|Set
 *   |TypedArray|DuplexStream|Iterator|AsyncIterator
 *   |{ chain: function }|{ flatMap: function }|Object
 *
 * Foldable = Iterable|AsyncIterable|{ reduce: function }
 *
 * streamFlatExtend(stream DuplexStream, item Monad|Foldable|any) -> stream
 */
const streamFlatExtend = function (stream, item) {
  const resultStreamWrite = curry2(streamWrite, stream, __),
    resultStreamWriteReducer = (_, subItem) => stream.write(subItem),
    promises = []
  if (isArray(item)) {
    const itemLength = item.length
    let itemIndex = -1
    while (++itemIndex < itemLength) {
      stream.write(item[itemIndex])
    }
  } else if (item == null) {
    stream.write(item)
  } else if (typeof item[symbolIterator] == 'function') {
    for (const subItem of item) {
      stream.write(subItem)
    }
  } else if (typeof item[symbolAsyncIterator] == 'function') {
    promises.push(
      asyncIteratorForEach(item[symbolAsyncIterator](), resultStreamWrite))
  } else if (typeof item.chain == 'function') {
    const monadValue = item.chain(identity)
    isPromise(monadValue)
      ? promises.push(monadValue.then(resultStreamWrite))
      : stream.write(monadValue)
  } else if (typeof item.flatMap == 'function') {
    const monadValue = item.flatMap(identity)
    isPromise(monadValue)
      ? promises.push(monadValue.then(resultStreamWrite))
      : stream.write(monadValue)
  } else if (typeof item.reduce == 'function') {
    const folded = item.reduce(resultStreamWriteReducer, null)
    isPromise(folded) && promises.push(folded)
  } else if (item.constructor == Object) {
    for (const key in item) {
      stream.write(item[key])
    }
  } else {
    stream.write(item)
  }
  return promises.length == 0
    ? stream
    : promiseAll(promises).then(always(stream))
}

/**
 * @name streamFlatMap
 *
 * @synopsis
 * DuplexStream = { read: function, write: function }
 *
 * Monad = Array|String|Set
 *   |TypedArray|DuplexStream|Iterator|AsyncIterator
 *   |{ chain: function }|{ flatMap: function }|Object
 *
 * Foldable = Iterable|AsyncIterable|{ reduce: function }
 *
 * streamFlatMap(
 *   stream DuplexStream,
 *   flatMapper item=>Promise|Monad|Foldable|any,
 * ) -> stream
 *
 * @related monadArrayFlatten
 */
const streamFlatMap = async function (stream, flatMapper) {
  const promises = new Set()
  for await (const item of stream) {
    const monad = flatMapper(item)
    if (isPromise(monad)) {
      const selfDeletingPromise = monad.then(
        curry2(streamFlatExtend, stream, __)).then(
          () => promises.delete(selfDeletingPromise))
      promises.add(selfDeletingPromise)
    } else {
      const streamFlatExtendOperation = streamFlatExtend(stream, monad)
      if (isPromise(streamFlatExtendOperation)) {
        const selfDeletingPromise = streamFlatExtendOperation.then(
          () => promises.delete(selfDeletingPromise))
        promises.add(selfDeletingPromise)
      }
    }
  }
  while (promises.size > 0) {
    await promiseRace(promises)
  }
  return stream
}

/**
 * @name arrayJoinToBinary
 *
 * @synopsis
 * arrayJoinToBinary(array Array, init TypedArray|Buffer) -> TypedArray|Buffer
 */
const arrayJoinToBinary = function (array, init) {
  const length = array.length
  let index = -1,
    result = init
  while (++index < length) {
    result = binaryExtend(result, array[index])
  }
  return result
}

/**
 * @name monadArrayFlattenToBinary
 *
 * @synopsis
 * Monad = Array|String|Set
 *   |TypedArray|DuplexStream|Iterator|AsyncIterator
 *   |{ chain: function }|{ flatMap: function }|Object
 *
 * Foldable = Iterable|AsyncIterable|{ reduce: function }
 *
 * monadArrayFlattenToBinary(
 *   array Array<Monad|Foldable|any>,
 *   result TypedAray|Buffer,
 * ) -> TypedArray|Buffer
 */
const monadArrayFlattenToBinary = function (array, result) {
  const flattened = monadArrayFlatten(array)
  return isPromise(flattened)
    ? flattened.then(curry2(arrayJoinToBinary, __, result))
    : arrayJoinToBinary(flattened, result)
}

/**
 * @name binaryFlatMap
 *
 * @synopsis
 * DuplexStream = { read: function, write: function }
 *
 * Monad = Array|String|Set
 *   |TypedArray|DuplexStream|Iterator|AsyncIterator
 *   |{ chain: function }|{ flatMap: function }|Object
 *
 * Foldable = Iterable|AsyncIterable|{ reduce: function }
 *
 * binaryFlatMap(
 *   stream DuplexStream,
 *   flatMapper item=>Promise|Monad|Foldable|any,
 * ) -> stream
 */
const binaryFlatMap = function (binary, flatMapper) {
  const monadArray = arrayMap(binary, flatMapper),
    result = globalThisHasBuffer && binary.constructor == Buffer
      ? bufferAlloc(0)
      : new binary.constructor(0)

  return isPromise(monadArray)
    ? monadArray.then(curry2(monadArrayFlattenToBinary, __, result))
    : monadArrayFlattenToBinary(monadArray, result)
}

/**
 * @name generatorFunctionFlatMap
 *
 * @synopsis
 * generatorFunctionFlatMap(
 *   generatorFunction GeneratorFunction,
 *   flatMapper item=>Promise|Monad|Foldable|any,
 * ) -> flatMappingGeneratorFunction GeneratorFunction
 *
 * @related monadArrayFlatten
 */
const generatorFunctionFlatMap = (
  generatorFunction, flatMapper,
) => function* flatMappingGeneratorFunction(...args) {
  for (const item of generatorFunction(...args)) {
    const monad = flatMapper(item)
    if (isArray(monad)) {
      const monadLength = monad.length
      let monadIndex = -1
      while (++monadIndex < monadLength) {
        yield monad[monadIndex]
      }
    } else if (monad == null) {
      yield monad
    } else if (typeof monad[symbolIterator] == 'function') {
      for (const subItem of monad) {
        yield subItem
      }
    } else if (typeof monad.chain == 'function') {
      yield monad.chain(identity)
    } else if (typeof monad.flatMap == 'function') {
      yield monad.flatMap(identity)
    } else if (typeof monad.reduce == 'function') {
      for (const monadItem of monad.reduce(arrayPush, [])) {
        yield monadItem
      }
    } else if (monad.constructor == Object) {
      for (const key in monad) {
        yield monad[key]
      }
    } else {
      yield monad
    }
  }
}

/**
 * @name asyncGeneratorFunctionFlatExtend
 *
 * @synopsis
 * asyncGeneratorFunctionFlatExtend(monad Monad|Foldable|any) -> AsyncIterator
 *
 * @related streamFlatExtend
 */
const asyncGeneratorFunctionFlatExtend = async function* (monad) {
  const asyncIterators = []
  if (isArray(monad)) {
    const monadLength = monad.length
    let monadIndex = -1
    while (++monadIndex < monadLength) {
      yield monad[monadIndex]
    }
  } else if (monad == null) {
    yield monad
  } else if (typeof monad[symbolIterator] == 'function') {
    yield* monad
  } else if (typeof monad[symbolAsyncIterator] == 'function') {
    yield* monad
  } else if (typeof monad.chain == 'function') {
    yield monad.chain(identity)
  } else if (typeof monad.flatMap == 'function') {
    yield monad.flatMap(identity)
  } else if (typeof monad.reduce == 'function') {
    for (const monadItem of monad.reduce(arrayPush, [])) {
      yield monadItem
    }
  } else if (monad.constructor == Object) {
    for (const key in monad) {
      yield monad[key]
    }
  } else {
    yield monad
  }
}

/**
 * @name asyncGeneratorFunctionFlatMap
 *
 * @synopsis
 * asyncGeneratorFunctionFlatMap(
 *   generatorFunction GeneratorFunction,
 *   flatMapper item=>Promise|Monad|Foldable|any,
 * ) -> flatMappingAsyncGeneratorFunction GeneratorFunction
 *
 * @related streamFlatMap
 */
const asyncGeneratorFunctionFlatMap = (
  asyncGeneratorFunction, flatMapper,
) => async function* flatMappingAsyncGeneratorFunction(...args) {
  for await (const item of asyncGeneratorFunction(...args)) {
    const monad = flatMapper(item)
    if (isPromise(monad)) {
      yield* (await monad.then(asyncGeneratorFunctionFlatExtend))
    } else {
      yield* asyncGeneratorFunctionFlatExtend(monad)
    }
  }
}

/**
 * @name reducerFlatMap
 *
 * @synopsis
 * DuplexStream = { read: function, write: function }
 *
 * Monad = Array|String|Set
 *   |TypedArray|DuplexStream|Iterator|AsyncIterator
 *   |{ chain: function }|{ flatMap: function }|Object
 *
 * Foldable = Iterable|AsyncIterable|{ reduce: function }
 *
 * reducerFlatMap(
 *   reducer (any, T)=>Promise|any,
 *   flatMapper item=>Promise|Monad|Foldable|any,
 * )
 *
 * @related forEachReduceConcurrent
 *
 * @note cannot use genericReduceConcurrent because
 */
const reducerFlatMap = (
  reducer, flatMapper,
) => function flatMappingReducer(result, value) {
  const monad = flatMapper(value)
  return isPromise(monad)
    ? monad.then(tacitGenericReduce(
      flatteningTransducer(reducer),
      result))
    : genericReduce([monad],
      flatteningTransducer(reducer),
      result)
}

/**
 * @name FlatMappingIterator
 *
 * @synopsis new FlatMappingIterator( iterator Iterator, flatMapper function,
 * ) -> FlatMappingIterator { next, SymbolIterator }
 */
const FlatMappingIterator = function (iterator, flatMapper) {
  this.iterator = iterator
  this.flatMapper = flatMapper
  this.buffer = []
  this.bufferIndex = Infinity
}

FlatMappingIterator.prototype = {
  [symbolIterator]() {
    return this
  },
  next() {
    if (this.bufferIndex < this.buffer.length) {
      const value = this.buffer[this.bufferIndex]
      this.bufferIndex += 1
      return { value, done: false }
    }

    const iteration = this.iterator.next()
    if (iteration.done) {
      return iteration
    }
    const monadAsArray = genericReduce( // TODO genericReduceSync
      [this.flatMapper(iteration.value)],
      flatteningTransducer(arrayExtend),
      []) // this will always have at least one item
    if (monadAsArray.length > 1) {
      this.buffer = monadAsArray
      this.bufferIndex = 1
    }
    return {
      value: monadAsArray[0],
      done: false,
    }
  },
}

/**
 * @name FlatMappingAsyncIterator
 *
 * @synopsis
 * FlatMappingAsyncIterator(
 *   asyncIterator AsyncIterator, flatMapper function,
 * ) -> FlatMappingAsyncIterator AsyncIterator
 *
 * @execution concurrent
 *
 * @muxing
 */
const FlatMappingAsyncIterator = function (asyncIterator, flatMapper) {
  this.asyncIterator = asyncIterator
  this.flatMapper = flatMapper
  this.buffer = []
  this.bufferIndex = Infinity
}

FlatMappingAsyncIterator.prototype = {
  [symbolAsyncIterator]() {
    return this
  },
  async next() {
    if (this.bufferIndex < this.buffer.length) {
      const value = this.buffer[this.bufferIndex]
      this.bufferIndex += 1
      return { value, done: false }
    }

    let iteration = this.asyncIterator.next()
    if (isPromise(iteration)) {
      iteration = await iteration
    }
    if (iteration.done) {
      return iteration
    }
    let monad = this.flatMapper(iteration.value)
    if (isPromise(monad)) {
      monad = await monad
    }
    let monadAsArray = genericReduce(
      [monad],
      flatteningTransducer(arrayExtend),
      []) // this will always have at least one item
    if (isPromise(monadAsArray)) {
      monadAsArray = await monadAsArray
    }
    if (monadAsArray.length > 1) {
      this.buffer = monadAsArray
      this.bufferIndex = 1
    }
    return {
      value: monadAsArray[0],
      done: false,
    }
  },
}

/**
 * @name flatMap
 *
 * @catchphrase
 * map then flatten
 *
 * @synopsis
 * ```coffeescript [specscript]
 * DuplexStream = { read: function, write: function }
 *
 * Monad = Array|String|Set
 *   |TypedArray|DuplexStream|Iterator|AsyncIterator
 *   |{ chain: function }|{ flatMap: function }|Object
 *
 * Foldable = Iterable|AsyncIterable|{ reduce: function }
 *
 * flatMap(
 *   flatMapper item=>Promise|Monad|Foldable|any,
 * )(value Monad<item any>) -> result Monad
 *
 * flatMap(
 *   flatMapper item=>Promise|Monad|Foldable|any,
 * )(
 *   value (args ...any)=>Generator<item>,
 * ) -> flatMappingGeneratorFunction ...args=>Generator
 *
 * flatMap(
 *   flatMapper item=>Promise|Monad|Foldable|any,
 * )(
 *   value (args ...any)=>AsyncGenerator<item>,
 * ) -> flatMappingAsyncGeneratorFunction ...args=>AsyncGenerator
 *
 * Reducer<T> = (any, T)=>Promise|any
 *
 * flatMap(
 *   flatMapper item=>Promise|Monad|Foldable|any,
 * )(value Reducer<item>) -> flatMappingReducer Reducer
 * ```
 *
 * @description
 * **flatMap** applies a function to each item of a Monad, flattening any resulting Monad or Foldable. The result is the same type as the input value with all items mapped and flattened. The following input values are valid arguments to `flatMap`
 *
 *  * Monad - a monoid in the category of endofunctors - should have notions of mapping and flattening (empty and concat)
 *    * Array - map items then flatten results into a new Array
 *    * String|string - map items then flatten (`+`) results into a new string
 *    * Set - map items while flattening results into a new set
 *    * TypedArray - map over bytes, then flatten results into a new TypedArray of the same type
 *      * Uint8ClampedArray
 *      * Uint8Array
 *      * Int8Array
 *      * Uint16Array
 *      * Int16Array
 *      * Uint32Array
 *      * Int32Array
 *      * Float32Array
 *      * Float64Array
 *      * BigUint64Array
 *      * BigInt64Array
 *      * Buffer (Node.js) - Node.js Buffers extend from Uint8Arrays
 *    * DuplexStream - Node.js stream.Duplex - map over stream items with `.read`, then call stream's `.write` to flatten
 *    * Object that implements `.chain` or `.flatMap` - either of these are called directly
 *    * Object - a plain Object, values are mapped with flatMapper, then only plain Objects are flattened into result.
 *  * Reducer - a function to be used in a flatMapping reducing operation with `reduce`
 *
 * To support concurrent execution of the flatMapper function, arrays are first mapped with the flatMapper, then flattened by concatenation.
 *
 * ```javascript-playground
 * const duplicate = number => [number, number]
 *
 * console.log(
 *   flatMap(duplicate)([1, 2, 3, 4, 5]),
 * ) // [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]
 *
 * const asyncIdentity = async value => value
 *
 * console.log(
 *   flatMap(asyncIdentity)([ // concurrent execution
 *     [1, 1],
 *     [2, 2],
 *     [3, 3],
 *     [4, 4],
 *     [5, 5],
 *   ]),
 * ) // Promise { [1, 1, 2, 2, 3, 3, 4, 4, 5, 5] }
 * ```
 *
 * The following is a list of all the items that `flatMap` flattens after concurrent execution of the flatMapper is complete. These items are all of the Foldable category, and have some notion of transformative iteration
 *
 * * Foldable
 *   * Iterable - implements Symbol.iterator
 *   * AsyncIterable - implements Symbol.asyncIterator
 *   * Iterator - implements Symbol.iterator that returns itself
 *   * AsyncIterator - implements Symbol.asyncIterator that returns itself
 *   * Generator - the product of a generator function `function* () {}`
 *   * AsyncGenerator - the product of an async generator function `async function* () {}`
 *   * Object that implements `.reduce` - this function is called directly for flattening
 *   * Object - a plain object, specifically its values are flattened
 *
 * All other types are not flattened and left in the result as is.
 *
 * ```javascript-playground
 * const identity = value => value
 *
 * flatMap(identity)([ // flatten
 *   [1, 1],
 *   new Set([2, 2]),
 *   (function* { yield 3; yield 3 })(),
 *   (async function* { yield 4; yield 4 })(),
 *   { a: 5, b: 5 },
 *   6,
 *   Promise.resolve(7),
 *   undefined,
 *   null,
 * ]).then(console.log) // [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 7, undefined, null]
 * ```
 *
 * Similar to the concurrent asynchronous behavior of `flatMap` applied to arrays, a flattening of asynchronous sources like Node.js streams muxes them together as a race of their items by default. This could be useful for perhaps muxing request streams in a webserver.
 *
 * `flatMap` also supports purer functional programming with monads. When a flatMapping operation encounters a Monad, it calls the monadic instance's `.chain` method to flatten it and access its functionality.
 *
 * ```javascript-playground
 * const Maybe = function (value) {
 *   this.value = value
 * }
 *
 * Maybe.prototype.chain = function (resolver) {
 *   if (this.value == null) {
 *     return this.value
 *   }
 *   return resolver(this.value)
 * } // resolver will be something
 *
 * console.log(
 *   flatMap(
 *     value => new Maybe(value),
 *   )([null, null, 1, 2, undefined, 3]),
 * ) // [1, 2, 3]
 * ```
 *
 * When `flatMap` receives a function as the first input argument, it creates a flatMapping version of a generator function, an async generator function, or a reducer depending on the type of input function.
 *
 * ```javascript-playground
 * const square = number => number ** 2
 *
 * const isOdd = number => number % 2 == 1
 *
 * const squaredOdds = pipe([
 *   filter(isOdd),
 *   map(square),
 * ])
 *
 * const squaredOdds = flatMap(
 *   number => isOdd(number) ? [number ** 2] : [])
 *
 * // TODO better example
 * ```
 *
 * @execution concurrent
 *
 * @transducing
 */
const flatMap = flatMapper => function flatMapping(value) {
  if (isArray(value)) {
    return arrayFlatMap(value, flatMapper)
  }
  if (isFunction(value)) {
    if (isGeneratorFunction(value)) {
      return generatorFunctionFlatMap(value, flatMapper)
    }
    if (isAsyncGeneratorFunction(value)) {
      return asyncGeneratorFunctionFlatMap(value, flatMapper)
    }
    return reducerFlatMap(value, flatMapper)
  }
  if (isBinary(value)) {
    return binaryFlatMap(value, flatMapper)
  }
  if (value == null) {
    return value
  }

  if (typeof value.next == 'function') {
    return symbolIterator in value
      ? new FlatMappingIterator(value, flatMapper)
      : new FlatMappingAsyncIterator(value, flatMapper)
  }
  if (typeof value.chain == 'function') {
    return value.chain(flatMapper)
  }
  if (typeof value.flatMap == 'function') {
    return value.flatMap(flatMapper)
  }
  if (
    typeof value[symbolAsyncIterator] == 'function'
      && typeof value.write == 'function'
  ) {
    return streamFlatMap(value, flatMapper)
  }
  const valueConstructor = value.constructor
  if (valueConstructor == Object) {
    return objectFlatMap(value, flatMapper)
  }
  if (valueConstructor == Set) {
    return setFlatMap(value, flatMapper)
  }
  if (typeof value == 'string' || valueConstructor == String) {
    return stringFlatMap(value, flatMapper)
  }
  return flatMapper(value)
}

/**
 * @name isDelimitedBy
 *
 * @synopsis
 * isDelimitedBy(delim string, value string) -> boolean
 */
const isDelimitedBy = (delim, value) => (value != null
  && value[0] !== delim
  && value[value.length - 1] !== delim
  && value.slice(1, value.length - 1).includes(delim))

/**
 * @name arrayPathGet
 *
 * @synopsis
 * arrayPathGet(
 *   path Array<string|number>,
 *   value any,
 *   defaultValue function|any,
 * ) -> result any
 */
const arrayPathGet = (path, value, defaultValue) => {
  if (value == null) {
    return isFunction(defaultValue) ? defaultValue(value) : defaultValue
  }
  const pathLength = path.length
  let result = value, i = -1
  while (++i < pathLength) {
    result = result[path[i]]
    if (result == null) {
      return isFunction(defaultValue) ? defaultValue(value) : defaultValue
    }
  }
  return result
}

/**
 * @name get
 *
 * @synopsis
 * get(
 *   path Array<number|string>|number|string,
 *   defaultValue function|any,
 * )(value any) -> result any
 *
 * @catchphrase
 * Access a property by path
 *
 * @description
 * **get** takes an Array of Numbers or Strings, Number, or String `path` argument, a function or any `defaultValue` argument, and returns a getter function that, when supplied any `value`, returns a property on that `value` described by `path`.
 *
 * @example
 * const nestedABC = { a: { b: { c: 1 } } }
 *
 * console.log(
 *   get('a.b.c')(nestedABC),
 * ) // 1
 */
const get = (path, defaultValue) => {
  if (isArray(path)) return value => arrayPathGet(path, value, defaultValue)
  if (isNumber(path)) return value => arrayPathGet([path], value, defaultValue)
  if (isString(path)) return (isDelimitedBy('.', path)
    ? value => arrayPathGet(path.split('.'), value, defaultValue)
    : value => arrayPathGet([path], value, defaultValue))
  throw new TypeError(`get(path); invalid path ${path}`)
}

/*
 * @synopsis
 * TODO
 */
const pickObject = (props, x) => {
  const y = {}
  for (let i = 0; i < props.length; i++) {
    if (isDefined(x[props[i]])) y[props[i]] = x[props[i]]
  }
  return y
}

/*
 * @synopsis
 * TODO
 */
const pick = props => {
  if (isArray(props)) return x => {
    if (isObject(x)) return pickObject(props, x)
    throw new TypeError('pick(...)(x); x is not an object')
  }
  throw new TypeError('pick(x); x is not an array')
}

/*
 * @synopsis
 * TODO
 */
const omitObject = (props, x) => {
  const y = Object.assign({}, x)
  for (let i = 0; i < props.length; i++) delete y[props[i]]
  return y
}

/*
 * @synopsis
 * TODO
 */
const omit = props => {
  if (isArray(props)) return x => {
    if (isObject(x)) return omitObject(props, x)
    throw new TypeError('omit(...)(x); x is not an object')
  }
  throw new TypeError('omit(x); x is not an array')
}

/*
 * @synopsis
 * TODO
 */
const anyIterable = (fn, x) => {
  const promises = []
  for (const xi of x) {
    const point = fn(xi)
    if (isPromise(point)) promises.push(point)
    else if (point) return (promises.length > 0
      ? Promise.all(promises).then(() => true)
      : true)
  }
  return (promises.length > 0
    ? Promise.all(promises).then(res => res.some(x => x))
    : false)
}

/*
 * @synopsis
 * TODO
 */
const anyObject = (fn, x) => anyIterable(
  fn,
  (function* () { for (const k in x) yield x[k] })(),
)

/*
 * @synopsis
 * TODO
 */
const any = fn => {
  if (!isFunction(fn)) {
    throw new TypeError('any(x); x is not a function')
  }
  return x => {
    if (isIterable(x)) return anyIterable(fn, x)
    if (isObject(x)) return anyObject(fn, x)
    throw new TypeError('any(...)(x); x invalid')
  }
}

/*
 * @synopsis
 * TODO
 */
const allIterable = (fn, x) => {
  const promises = []
  for (const xi of x) {
    const point = fn(xi)
    if (isPromise(point)) promises.push(point)
    else if (!point) return (promises.length > 0
      ? Promise.all(promises).then(() => false)
      : false)
  }
  return (promises.length > 0
    ? Promise.all(promises).then(res => res.every(x => x))
    : true)
}

/*
 * @synopsis
 * TODO
 */
const allObject = (fn, x) => allIterable(
  fn,
  (function* () { for (const k in x) yield x[k] })(),
)

/*
 * @synopsis
 * TODO
 */
const all = fn => {
  if (!isFunction(fn)) {
    throw new TypeError('all(x); x is not a function')
  }
  return x => {
    if (isIterable(x)) return allIterable(fn, x)
    if (isObject(x)) return allObject(fn, x)
    throw new TypeError('all(...)(x); x invalid')
  }
}

/*
 * @synopsis
 * TODO
 */
const arrayAnd = (fns, x) => {
  const promises = []
  for (let i = 0; i < fns.length; i++) {
    const point = fns[i](x)
    if (isPromise(point)) promises.push(point)
    else if (!point) return (promises.length > 0
      ? Promise.all(promises).then(() => false)
      : false)
  }
  return (promises.length > 0
    ? Promise.all(promises).then(res => res.every(x => x))
    : true)
}

/*
 * @synopsis
 * TODO
 */
const and = fns => {
  if (!isArray(fns)) {
    throw new TypeError('and(x); x is not an array of functions')
  }
  if (fns.length < 1) {
    throw new RangeError('and(x); x is not an array of at least one function')
  }
  for (let i = 0; i < fns.length; i++) {
    if (isFunction(fns[i])) continue
    throw new TypeError(`and(x); x[${i}] is not a function`)
  }
  return x => arrayAnd(fns, x)
}

/*
 * @synopsis
 * TODO
 */
const arrayOr = (fns, x) => {
  const promises = []
  for (let i = 0; i < fns.length; i++) {
    const point = fns[i](x)
    if (isPromise(point)) promises.push(point)
    else if (point) return (promises.length > 0
      ? Promise.all(promises).then(() => true)
      : true)
  }
  return (promises.length > 0
    ? Promise.all(promises).then(res => res.some(x => x))
    : false)
}

/*
 * @synopsis
 * TODO
 */
const or = fns => {
  if (!isArray(fns)) {
    throw new TypeError('or(fns); fns is not an array of functions')
  }
  if (fns.length < 1) {
    throw new RangeError('or(fns); fns is not an array of at least one function')
  }
  for (let i = 0; i < fns.length; i++) {
    if (isFunction(fns[i])) continue
    throw new TypeError(`or(fns); fns[${i}] is not a function`)
  }
  return x => arrayOr(fns, x)
}

/*
 * @synopsis
 * TODO
 */
const not = fn => {
  if (!isFunction(fn)) {
    throw new TypeError('not(x); x is not a function')
  }
  return x => possiblePromiseThen(fn(x), res => !res)
}

/*
 * @synopsis
 * TODO
 */
const eq = (f, g) => {
  if (isFunction(f) && isFunction(g)) return x => (
    possiblePromiseAll([f(x), g(x)]).then(([fx, gx]) => fx === gx))
  if (isFunction(f)) return x => possiblePromiseThen(f(x), fx => fx === g)
  if (isFunction(g)) return x => possiblePromiseThen(g(x), gx => f === gx)
  const h = f === g
  return () => h
}

/*
 * @synopsis
 * TODO
 */
const gt = function (f, g) {
  if (isFunction(f) && isFunction(g)) return x => (
    possiblePromiseAll([f(x), g(x)]).then(([fx, gx]) => fx > gx))
  if (isFunction(f)) return x => possiblePromiseThen(f(x), fx => fx > g)
  if (isFunction(g)) return x => possiblePromiseThen(g(x), gx => f > gx)
  const h = f > g
  return () => h
}

/*
 * @synopsis
 * TODO
 */
const lt = function (f, g) {
  if (isFunction(f) && isFunction(g)) return x => (
    possiblePromiseAll([f(x), g(x)]).then(([fx, gx]) => fx < gx))
  if (isFunction(f)) return x => possiblePromiseThen(f(x), fx => fx < g)
  if (isFunction(g)) return x => possiblePromiseThen(g(x), gx => f < gx)
  const h = f < g
  return () => h
}

/*
 * @synopsis
 * TODO
 */
const gte = function (f, g) {
  if (isFunction(f) && isFunction(g)) return x => (
    possiblePromiseAll([f(x), g(x)]).then(([fx, gx]) => fx >= gx))
  if (isFunction(f)) return x => possiblePromiseThen(f(x), fx => fx >= g)
  if (isFunction(g)) return x => possiblePromiseThen(g(x), gx => f >= gx)
  const h = f >= g
  return () => h
}

/*
 * @synopsis
 * TODO
 */
const lte = function (f, g) {
  if (isFunction(f) && isFunction(g)) return x => (
    possiblePromiseAll([f(x), g(x)]).then(([fx, gx]) => fx <= gx))
  if (isFunction(f)) return x => possiblePromiseThen(f(x), fx => fx <= g)
  if (isFunction(g)) return x => possiblePromiseThen(g(x), gx => f <= gx)
  const h = f <= g
  return () => h
}

return {
  pipe, fork, assign,
  tap, tryCatch, switchCase,
  map, filter, reduce, transform, flatMap,
  any, all, and, or, not,
  eq, gt, lt, gte, lte,
  get, pick, omit,
}

})()))
