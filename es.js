/* rubico v1.5.12
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2020 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

const symbolIterator = Symbol.iterator

const symbolAsyncIterator = Symbol.asyncIterator

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

const arrayOf = (item, length) => Array.from({ length }, () => item)

/**
 * @name always
 *
 * @synopsis
 * always(value any) -> getter ()=>value
 */
const always = value => function getter() { return value }

/**
 * @name thunkifyCallUnary
 *
 * @synopsis
 * thunkifyCallUnary(func function, args Array) -> ()=>func(...args)
 */
const thunkifyCallUnary = (func, argument) => () => func(argument)

/**
 * @name arrayPush
 *
 * @synopsis
 * arrayPush(array Array, value any, index undefined|number) => array
 */
const arrayPush = function (
  array, value, index = array.length,
) {
  array[index] = value
  return array
}

/**
 * @name arrayExtend
 *
 * @synopsis
 * arrayExtend(array Array, values Array) -> array
 */
const arrayExtend = (array, values) => {
  const arrayLength = array.length,
    valuesLength = values.length
  let valuesIndex = -1
  while (++valuesIndex < valuesLength) {
    array[arrayLength + valuesIndex] = values[valuesIndex]
  }
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
 * setExtend(set, values Set) -> set
 */
const setExtend = (set, values) => {
  for (const item of values) {
    set.add(item)
  }
  return set
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
const funcConcat = (funcA, funcB) => function pipedFunction(...args) {
  const intermediate = funcA(...args)
  return isPromise(intermediate)
    ? intermediate.then(funcB)
    : funcB(intermediate)
}

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
 * @transducers
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
      ? result.catch(err => catcher(err, ...args))
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
 * @name funcConditional
 *
 * @synopsis
 * funcConditional(
 *   funcs Array<args=>Promise|any>,
 * )(args ...any) -> Promise|any
 *
 * @TODO .then quickscope
 */
const funcConditional = funcs => function funcSwitching(...args) {
  const lastIndex = funcs.length - 1
  let funcsIndex = -2
  while ((funcsIndex += 2) < lastIndex) {
    const shouldReturnNext = funcs[funcsIndex](...args)
    if (isPromise(shouldReturnNext)) {
      return shouldReturnNext.then(res => res
        ? funcs[funcsIndex + 1](...args)
        : asyncFuncSwitch(funcs, args, funcsIndex))
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
 * switchCase(fns Array<function>)(x any) -> Promise|any
 */
const switchCase = funcConditional

/*
 * @synopsis
 * mapArray(f function, x Array<any>) -> Array<any>|Promise<Array<any>>
 *
 * @note
 * x.map
 * https://v8.dev/blog/elements-kinds#avoid-polymorphism
 */
const mapArray = (f, x) => {
  let isAsync = false
  const y = x.map(xi => {
    const point = f(xi)
    if (isPromise(point)) isAsync = true
    return point
  })
  return isAsync ? Promise.all(y) : y
}

/*
 * @synopsis
 * mapSet(f function, x Set<any>) -> Set<any>
 */
const mapSet = (f, x) => {
  const y = new Set(), promises = []
  for (const xi of x) {
    const yi = f(xi)
    if (isPromise(yi)) {
      promises.push(yi.then(res => { y.add(res) }))
    } else {
      y.add(yi)
    }
  }
  return promises.length > 0 ? Promise.all(promises).then(() => y) : y
}

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
  let index = -1, isAsync = false
  while (++index < arrayLength) {
    const resultItem = mapper(array[index])
    if (isPromise(resultItem)) isAsync = true
    result[index] = resultItem
  }
  return isAsync ? promiseAll(result) : result
}

/**
 * @name objectMap
 *
 * @synopsis
 * any -> A, any -> B
 *
 * objectMap(object Object<A>, mapper A=>Promise|B) -> Promise|Object<B>
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
 * new MappingIterator(iter Iterator, mapper function) -> MappingIterator
 */
const MappingIterator = function (iter, mapper) {
  this.iter = iter
  this.mapper = mapper
}

/**
 * @name MappingIterator.prototype[Symbol.iterator]
 *
 * @synopsis
 * new MappingIterator(
 *   iter Iterator,
 *   mapper function,
 * )[Symbol.iterator]() -> MappingIterator
 */
MappingIterator.prototype[symbolIterator] = function mappingValues() {
  return this
}

/**
 * @name MappingIterator.prototype.next
 *
 * @synopsis
 * new MappingIterator(
 *   iter Iterator,
 *   mapper function,
 * ).next() -> { value: any, done: boolean }
 */
MappingIterator.prototype.next = function next() {
  const { value, done } = this.iter.next()
  return done ? { value, done } : { value: this.mapper(value), done }
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
 * @name MappingAsyncIterator
 *
 * @synopsis
 * new MappingAsyncIterator(
 *   asyncIter Iterator,
 *   mapper function,
 * ) -> MappingAsyncIterator
 */
const MappingAsyncIterator = function (asyncIter, mapper) {
  this.asyncIter = asyncIter
  this.mapper = mapper
}

/**
 * @name MappingAsyncIterator.prototype[symbolAsyncIterator]
 *
 * @synopsis
 * new MappingAsyncIterator(
 *   asyncIter Iterator,
 *   mapper function,
 * )[Symbol.asyncIterator]() -> MappingAsyncIterator
 */
MappingAsyncIterator.prototype[symbolAsyncIterator] = function mappingValues() {
  return this
}

/**
 * @name MappingAsyncIterator.prototype.next
 *
 * @synopsis
 * new MappingAsyncIterator(
 *   asyncIter Iterator,
 *   mapper function,
 * ).next() -> Promise|{ value: any, done: boolean }
 */
MappingAsyncIterator.prototype.next = async function next() {
  const { value, done } = await this.asyncIter.next()
  if (done) return { value: undefined, done: true }
  const resultItem = this.mapper(value)
  return isPromise(resultItem)
    ? resultItem.then(res => ({ value: res, done: false }))
    : ({ value: resultItem, done: false })
}

/**
 * @name curriedReducer
 *
 * @synopsis
 * any -> T
 *
 * curriedReducer(
 *   reducer (any, T)=>any,
 *   result any,
 * ) -> curried (value T)=>any
 */
const curriedReducer = (reducer, result) => function curried(value) {
  return reducer(result, value)
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
    ? mapped.then(curriedReducer(reducer, result))
    : reducer(result, mapped)
}

/**
 * @name resolverMap
 *
 * @synopsis
 * any -> A; any -> B
 *
 * resolverMap(
 *   resolver ...args=>A,
 *   mapper A=>B,
 * ) -> (args ...any)=>B
const resolverMap = (resolver, mapper) => funcConcat(resolver, map(mapper))
 */

/**
 * @name map.resolver
 *
 * @catchphrase
 * lazy map
map.resolver = function resolverMap(mapper) {
  return function mapping(resolver) {
    return resolverMap(resolver, mapper)
  }
}
 */

/**
 * @name map
 *
 * @catchphrase
 * linearly transform data
 *
 * @synopsis
 * any -> T
 *
 * (any, T)=>Promise|any -> Reducer<T>
 *
 * any -> A; any -> B; any -> C
 *
 * { map: (A=>B)=>Mappable<B> } -> Mappable<A>
 *
 * map(
 *   A=>Promise|B,
 * )(Array<A>) -> Promise|Array<B>
 *
 * map(
 *   A=>Promise|B,
 * )(Object<A>) -> Promise|Object<B>
 *
 * map(A=>B)(GeneratorFunction<A>) -> GeneratorFunction<B>
 *
 * map(A=>B)(Iterator<A>) -> Iterator<B>
 *
 * map(A=>Promise|B)(AsyncGeneratorFunction<A>) -> AsyncGeneratorFunction<B>
 *
 * map(A=>Promise|B)(AsyncIterator<A>) -> AsyncIterator<B>
 *
 * map(A=>Promise|B)(Reducer<A>) -> Reducer<B>
 *
 * map(A=>B)(Mappable<A>) -> Mappable<B>
 *
 * map(A=>Promise|B)(A) -> Promise|B
 *
 * @description
 * **map** takes a function and applies it to each item of a collection, returning a collection of the same type with all resulting items. If a collection has an implicit order, e.g. an Array, the resulting collection will have the same order. If the input collection does not have an implicit order, the order of the result is not guaranteed.
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
 * The generator function and its product, the generator, are more additions to the list of possible things to map over. The same goes for their async counterparts.
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
 * Finally, **map** works with reducer functions to create transducers.
 *
 * ```
 * any -> T
 *
 * (any, T)=>Promise|any -> Reducer<T>
 *
 * Reducer=>Reducer -> Transducer
 * ```
 *
 * A reducer is a function that takes a generic of any type T, a given instance of type T, and returns possibly a Promise of a generic of type T. A transducer is a function that takes a reducer and returns another reducer.
 *
 * ```
 * any -> A, any -> B
 *
 * map(mapper A=>Promise|B)(Reducer<A>) -> Reducer<B>
 * ```
 *
 * When passed a reducer, a mapping function returns another reducer with each given item T transformed by the mapper function. For more information on this behavior, see [transducers](https://github.com/a-synchronous/rubico/blob/master/TRANSDUCERS.md)
 *
 * ```javascript-playground
 * const square = number => number ** 2
 *
 * const concat = (array, item) => array.concat(item)
 *
 * const squareConcatReducer = map(square)(concat)
 *
 * console.log(
 *   [1, 2, 3, 4, 5].reduce(squareConcatReducer, []),
 * ) // [1, 4, 9, 16, 25]
 * ```
 *
 * By default, **map** looks for a `.map` property function on the input value, and if present, calls the `.map` property function with the provided mapper function. Otherwise, **map** returns the application of the mapper function with the input value.
 *
 * @execution concurrent
 *
 * @transducers
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
      return resultItem.then(res => {
        result[index] = res
        return asyncArrayMapSeries(array, mapper, result, index)
      })
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
      const selfDeletingPromise = resultItem.then(res => {
        promises.delete(selfDeletingPromise)
        return res
      })
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
      const promises = new Set()
      const selfDeletingPromise = resultItem.then(res => {
        promises.delete(selfDeletingPromise)
        return res
      })
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
    if (isPromise(resultItem)) isAsync = true
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
 * @name arrayFilterConditionsResolver
 *
 * @synopsis
 * any -> T
 *
 * arrayFilterConditionsResolver(
 *   array Array<T>,
 *   result Array<T>,
 *   index number,
 * ) -> resolvingShouldIncludeItems(
 *   shouldIncludeItem Array<boolean>,
 * )=>result
 *
 * @description
 * For quickscoping filter* .then handlers. index should already be processed.
 */
const arrayFilterConditionsResolver = (
  array, result, index,
) => function resolvingShouldIncludeItems(shouldIncludeItems) {
  const arrayLength = array.length
  let resultIndex = result.length - 1,
    shouldIncludeItemsIndex = -1
  while (++index < arrayLength) {
    if (shouldIncludeItems[++shouldIncludeItemsIndex]) {
      result[++resultIndex] = array[index]
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
            arrayFilterConditionsResolver(array, result, index - 1))
    }
    if (shouldIncludeItem) {
      result[++resultIndex] = item
    }
  }
  return result
}

/**
 * @name objectSetConditionResolver
 *
 * @synopsis
 * any -> T
 *
 * objectSetConditionResolver(
 *   object Object<T>,
 *   result Object<T>,
 *   key string,
 * ) -> settingValueIfTruthy (shouldIncludeItem boolean)=>()
 */
const objectSetConditionResolver = (
  object, result, key,
) => function settingValueIfTruthy(shouldIncludeItem) {
  if (shouldIncludeItem) {
    result[key] = object[key]
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
      promises[promises.length] = shouldIncludeItem.then(
        objectSetConditionResolver(object, result, key))
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
 * new FilteringIterator(
 *   iter Iterator<T>,
 *   predicate T=>boolean,
 * ) -> FilteringIterator<T>
 */
const FilteringIterator = function (iter, predicate) {
  this.iter = iter
  this.predicate = predicate
}

/**
 * @name FilteringIterator.prototype[Symbol.iterator]
 *
 * @synopsis
 * new FilteringIterator(
 *   iter Iterator,
 *   predicate function,
 * )[Symbol.iterator]() -> FilteringIterator
 */
FilteringIterator.prototype[symbolIterator] = function filteringValues() {
  return this
}

/**
 * @name FilteringIterator.prototype.next
 *
 * @synopsis
 * new FilteringIterator(
 *   iter Iterator,
 *   predicate function,
 * ).next() -> { value: any, done: boolean }
 */
FilteringIterator.prototype.next = function next() {
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
  return { value: undefined, done: true }
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
 * new FilteringAsyncIterator(
 *   asyncIter AsyncIterator<T>,
 *   predicate T=>boolean,
 * ) -> FilteringAsyncIterator<T>
 */
const FilteringAsyncIterator = function (asyncIter, predicate) {
  this.asyncIter = asyncIter
  this.predicate = predicate
}

/**
 * @name FilteringAsyncIterator.prototype[Symbol.asyncIterator]
 *
 * @synopsis
 * new FilteringAsyncIterator(
 *   asyncIter AsyncIterator,
 *   predicate function,
 * )[Symbol.asyncIterator]() -> FilteringAsyncIterator
 */
FilteringAsyncIterator.prototype[symbolAsyncIterator] = function filteringValues() {
  return this
}

/**
 * @name FilteringAsyncIterator.prototype.next
 *
 * @synopsis
 * new FilteringAsyncIterator(
 *   asyncIter AsyncIterator,
 *   predicate function,
 * ).next() -> { value: any, done: boolean }
 */
FilteringAsyncIterator.prototype.next = async function next() {
  const thisIterNext = this.asyncIter.next.bind(this.asyncIter),
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
  return { value: undefined, done: true }
}

/**
 * @name reducerFilterConditionResolver
 *
 * @synopsis
 * any -> T
 *
 * reducerFilterConditionResolver(
 *   reducer (any, T)=>Promise|any,
 *   result any,
 *   item T,
 * ) -> (shouldIncludeItem boolean)=>result
 */
const reducerFilterConditionResolver = (
  reducer, result, item,
) => function conditionResolver(shouldIncludeItem) {
  return shouldIncludeItem ? reducer(result, item) : result
}

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
  const shouldIncludeItem = predicate(item)
  if (isPromise(shouldIncludeItem)) {
    return shouldIncludeItem.then(
      reducerFilterConditionResolver(reducer, result, item))
  }
  return shouldIncludeItem ? reducer(result, item) : result
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
 * @transducers
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
            arrayFilterConditionsResolver(array, result, index - 1))
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
 * @name asyncArrayReduceResultResolver
 *
 * @synopsis
 * asyncArrayReduceResultResolver(
 *   array Array,
 *   reducer function,
 *   index number,
 * ) -> resolver result=>any
 */
const asyncArrayReduceResultResolver = (
  array, reducer, index,
) => function resolver(result) {
  return asyncArrayReduce(array, reducer, result, index)
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
        asyncArrayReduceResultResolver(array, reducer, index))
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
 * @name tacitAsyncIteratorReduce
 *
 * @synopsis
 * any -> T
 *
 * tacitAsyncIteratorReduce(
 *   reducer (any, T)=>Promise|any,
 *   result any,
 * ) -> resolver (asyncIterator AsyncIterator<T>)=>any
 */
const tacitAsyncIteratorReduce = (
  reducer, result,
) => function resolver(asyncIterator) {
  return asyncIteratorReduce(asyncIterator, reducer, result)
}

/**
 * @name asyncIteratorReduceResultResolver
 *
 * @synopsis
 * any -> T
 *
 * asyncIteratorReduceResultResolver(
 *   asyncIterator AsyncIterator<T>,
 *   reducer (any, T)=>Promise|any,
 * ) -> resolver (result any)=>any
 */
const asyncIteratorReduceResultResolver = (
  asyncIterator, reducer,
) => function resolver(result) {
  return asyncIteratorReduce(asyncIterator, reducer, result)
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
  asyncGeneratorFunc, tacitAsyncIteratorReduce(reducer, result))

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
      return result.then(
        asyncIteratorReduceResultResolver(iterator, reducer))
    }
    iteration = iterator.next()
  }
  return result
}

/**
 * @name tacitIteratorReduce
 *
 * @synopsis
 * any -> T
 *
 * tacitIteratorReduce(
 *   reducer (any, T)=>Promise|any,
 *   result any,
 * ) -> resolver (iterator Iterator<T>)=>Promise|any
 */
const tacitIteratorReduce = (
  reducer, result,
) => function resolver(iterator) {
  return iteratorReduce(iterator, reducer, result)
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
) => funcConcat(generatorFunc, tacitIteratorReduce(reducer, result))

/**
 * @name reducerResultResolver
 *
 * @synopsis
 * any -> T
 *
 * reducerResultResolver(
 *   reducer (result, T)=>result,
 *   item T,
 * )(result any) -> result
 */
const reducerResultResolver = (
  reducer, item,
) => function reducing(result) {
  return reducer(result, item)
}

/**
 * @name reducerConcat
 *
 * @synopsis
 * any -> T
 *
 * reducerConcat(
 *   reducerA (any, T)=>(intermediate any),
 *   reducerB (intermediate, T)=>any,
 * ) -> pipedReducer (any, T)=>any
 */
const reducerConcat = function (reducerA, reducerB) {
  return function pipedReducer(result, item) {
    const intermediate = reducerA(result, item)
    return isPromise(intermediate)
      ? intermediate.then(reducerResultResolver(reducerB, item))
      : reducerB(intermediate, item)
  }
}

/**
 * @name reducerEmpty
 *
 * @synopsis
 * reducerEmpty(result any) -> result
const reducerEmpty = result => result
 */

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
 */
var genericReduce = function (args, reducer, result) {
  const collection = args[0]
  if (isArray(collection)) {
    return arrayReduce(collection, reducer, result)
  }
  if (collection == null) {
    return result
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
      args.length == 0 ? reducer : args.reduce(reducerConcat, reducer), result)
  }
  if (typeof collection.reduce == 'function') {
    return collection.reduce(reducer, result)
  }
  if (collection.constructor == Object) {
    return arrayReduce(objectValues(collection), reducer, result)
  }
  return result === undefined
    ? reducer(collection)
    : reducer(result, collection)
}

/**
 * @name curriedGenericReduce
 *
 * @synopsis
 * curriedGenericReduce(
 *   args Array,
 *   reducer function,
 * ) -> resolver (result any)=>any
 */
const curriedGenericReduce = (
  args, reducer,
) => function resolver(result) {
  return genericReduce(args, reducer, result)
}

/**
 * @name reduce
 *
 * @catchphrase
 * execute data transformation by reducer
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
 * @transducers
 *
 * @note
 * https://stackoverflow.com/questions/30233302/promise-is-it-possible-to-force-cancel-a-promise/30235261#30235261
 * https://stackoverflow.com/questions/62336381/is-this-promise-cancellation-implementation-for-reducing-an-async-iterable-on-th
 *
 * @TODO readerReduce
 */
const reduce = function (reducer, init) {
  if (isFunction(init)) {
    return function reducing(...args) {
      return then(
        init(...args),
        curriedGenericReduce(args, reducer))
    }
  }
  return function reducing(...args) {
    return genericReduce(args, reducer, init)
  }
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
const emptyTransform = (args, transducer, result) => then(
  genericReduce(args, transducer(identity), null),
  always(result))

/**
 * @name arrayConcat
 *
 * @synopsis
 * arrayConcat(
 *   array Array,
 *   values Array|any,
 * ) -> array
 */
const arrayConcat = (array, values) => isArray(values)
  ? arrayExtend(array, values)
  : arrayPush(array, values)

/**
 * @name typedArrayExtend
 *
 * @synopsis
 * typedArrayExtend(
 *   typedArray TypedArray,
 *   array Array|TypedArray|any,
 * ) -> concatenatedTypedArray
 */
const typedArrayExtend = function (typedArray, array) {
  const offset = typedArray.length
  const result = new typedArray.constructor(offset + array.length)
  result.set(typedArray)
  result.set(array, offset)
  return result
}

/**
 * @name curriedTypedArrayExtend
 *
 * @synopsis
 * curriedTypedArrayExtend(
 *   typedArray TypedArray,
 * )(array Array|TypedArray) -> extended TypedArray
 */
const curriedTypedArrayExtend = typedArray => function curried(array) {
  return typedArrayExtend(typedArray, array)
}

/**
 * @name setConcat
 *
 * @synopsis
 * setConcat(
 *   set Set,
 *   values Set|any
 * ) -> set
 */
const setConcat = (set, values) => isSet(values)
  ? setExtend(set, values)
  : setAdd(set, values)

/**
 * @name curriedStreamExtend
 *
 * @synopsis
 * curriedStreamExtend(stream Writable)(
 *   chunk string|Buffer|Uint8Array|any,
 *   encoding string|undefined,
 *   callback function|undefined,
 * ) -> stream
 */
const curriedStreamExtend = stream => function concat(
  chunk, encoding, callback,
) {
  if (isBinary(chunk) || isString(chunk)) {
    const chunkLength = chunk.length
    let index = -1
    while (++index < chunkLength) {
      stream.write(chunk[index], encoding, callback)
    }
  } else { // objectMode
    stream.write(chunk, encoding, callback)
  }
  return stream
}

/**
 * @name streamFlatExtendExecutor
 *
 * @synopsis
 * streamFlatExtendExecutor(
 *   resultStream Writable, stream Readable,
 * ) -> executor (resolve function, reject function)=>()
 *
 * @note optimizes function creation within streamExtend
 */
const streamFlatExtendExecutor = (
  resultStream, stream,
) => function executor(resolve, reject) {
  stream.on('data', curriedStreamExtend(resultStream))
  stream.on('end', thunkifyCallUnary(resolve, resultStream))
  stream.on('error', reject)
}

/**
 * @name streamFlatExtend
 *
 * @synopsis
 * streamFlatExtend(
 *   resultStream Writable, stream Readable,
 * ) -> writableStream
 */
const streamFlatExtend = (
  resultStream, stream,
) => new Promise(streamFlatExtendExecutor(resultStream, stream))

/**
 * @name writableStreamConcat
 *
 * @synopsis
 * Writable = { write: function }
 *
 * Readable = { pipe: function }
 *
 * writableStreamConcat(
 *   stream Writable,
 *   values Readable|any,
 * ) -> stream
 *
 * @note support `.read` maybe
 */
const writableStreamConcat = function (stream, values) {
  if (isNodeReadStream(values)) {
    return streamFlatExtend(stream, values)
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
    return genericReduce(args, transducer(arrayConcat), result)
  }
  if (isBinary(result)) {
    return then(
      genericReduce(args, transducer(arrayConcat), []),
      curriedTypedArrayExtend(result))
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
    return genericReduce(args, transducer(writableStreamConcat), result)
  }
  if (resultConstructor == Set) {
    return genericReduce(args, transducer(setConcat), result)
  }
  if (resultConstructor == Object) {
    return genericReduce(args, transducer(objectAssign), result)
  }
  return emptyTransform(args, transducer, result)
}

/**
 * @name curriedGenericTransform
 *
 * @synopsis
 * Semigroup = Array|string|Set|TypedArray
 *   |{ concat: function }|{ write: function }|Object
 *
 * curriedGenericTransform(
 *   collection any,
 *   transducer function,
 * ) -> resolver (result Semigroup|any)=>any
 */
const curriedGenericTransform = (
  args, transducer,
) => function resolver(result) {
  return genericTransform(args, transducer, result)
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
 * @transducers
 */
const transform = function (transducer, init) {
  if (isFunction(init)) {
    return function reducing(...args) {
      return then(
        init(...args),
        curriedGenericTransform(args, transducer))
    }
  }
  return function reducing(...args) {
    return genericTransform(args, transducer, init)
  }
}

  /*
var transform = (fn, init) => {
  if (!isFunction(fn)) {
    throw new TypeError('transform(x, y); y is not a function')
  }
  return x => possiblePromiseThen(
    isFunction(init) ? init(x) : init,
    res => _transformBranch(fn, res, x),
  )
}
*/

// concat is (result, item, index, collection) => result
// transform.withIndex = (transducer, init) => {}

/**
 * @name arrayPushArray
 *
 * @synopsis
 * arrayPushArray(arrayA Array, arrayB Array) -> undefined
 */
const arrayPushArray = (arrayA, arrayB) => {
  const offset = arrayA.length, length = arrayB.length
  let i = -1
  while (++i < length) {
    arrayA[offset + i] = arrayB[i]
  }
}

/**
 * @name arrayPushIterable
 *
 * @synopsis
 * arrayPushIterable(x Array, array Array) -> undefined
 */
const arrayPushIterable = (x, iterable) => {
  const offset = x.length
  let i = 0
  for (const value of iterable) {
    x[offset + i] = value
    i += 1
  }
}

/**
 * @name arrayFlatten
 *
 * @synopsis
 * <T any>arrayFlatten(Array<Array<T>|T>) -> Array<T>
 */
const arrayFlatten = x => {
  const y = []
  for (const xi of x) {
    (isArray(xi) ? arrayPushArray(y, xi) :
      isIterable(xi) ? arrayPushIterable(y, xi) : y.push(xi))
  }
  return y
}

/*
 * @name genericFlatten
 *
 * @synopsis
 * <T any>genericFlatten(
 *   method string,
 *   y Set<>,
 *   x Iterable<Iterable<T>|T>,
 * ) -> Set<T>
 */
const genericFlatten = (method, y, x) => {
  const add = y[method].bind(y)
  for (const xi of x) {
    if (isIterable(xi)) {
      for (const v of xi) add(v)
    } else {
      add(xi)
    }
  }
  return y
}

/**
 * @name flatMapArray
 *
 * @synopsis
 * <A any, B any>flatMapArray(
 *   func A=>Iterable<B>|B,
 *   arr Array<A>,
 * ) -> result Promise<Array<B>>|Array<B>
 */
const flatMapArray = (func, arr) => (
  possiblePromiseThen(mapArray(func, arr), arrayFlatten))

/**
 * @name flatMapSet
 *
 * @synopsis
 * <A any, B any>flatMapSet(
 *   func A=>Iterable<B>|B,
 *   set Set<A>
 * ) -> result Promise<Set<B>>|Set<B>
 */
const flatMapSet = (func, set) => possiblePromiseThen(
  mapSet(func, set),
  res => genericFlatten('add', new Set(), res),
)

/**
 * @name flatMapReducer
 *
 * @synopsis
 * <A any, B any>flatMapReducer(
 *   func A=>Iterable<B>|B,
 *   reducer (any, A)=>any
 * ) -> transducedReducer (aggregate any, value A)=>Promise|any
 */
const flatMapReducer = (func, reducer) => (aggregate, value) => (
  possiblePromiseThen(func(value), reduce(reducer, aggregate)))

/**
 * @name flatMap
 *
 * @synopsis
 * <A any, B any>flatMap(
 *   func A=>Iterable<B>|B
 * )(value Array<Array<A>|A>) -> result Array<B>
 *
 * <A any, B any>flatMap(
 *   func A=>Iterable<B>|B
 * )(value Set<Set<A>|A>) -> result Set<B>
 *
 * <A any, B any>flatMap(
 *   func A=>Iterable<B>|B
 * )(value (any, any)=>any) -> transducedReducer (any, any)=>any
 *
 * @catchphrase
 * map then flatten
 *
 * @description
 * **flatMap** accepts a mapper function `func` and an Array or Set `value`, and returns a new flattened and mapped Array or Set `result`. Each item of `result` is the result of applying the mapper function `func` to a given item of the input Array or Set `value`. The final `result` Array or Set is flattened one depth level.
 *
 * When `value` is a reducer function, the result is another reducer function `transducedReducer` that represents a flatMap step in a transducer chain. A flatMap step involves the application of the mapper function `func` to a given element of a collecting being reduced, then flattening the result into the aggregate. For more information on this behavior, please see [transducers](https://github.com/a-synchronous/rubico/blob/master/TRANSDUCERS.md).
 *
 * @example
 * console.log(
 *   flatMap(
 *     number => [number ** 2, number ** 3],
 *   )([1, 2, 3]),
 * ) // [1, 1, 4, 8, 9, 27]
 *
 * @execution concurrent
 */
const flatMap = func => {
  if (!isFunction(func)) {
    throw new TypeError('flatMap(func); func is not a function')
  }
  return value => {
    if (isArray(value)) return flatMapArray(func, value)
    if (isSet(value)) return flatMapSet(func, value)
    if (isFunction(value)) return flatMapReducer(func, value)
    throw new TypeError(`flatMap(...)(value); invalid value ${value}`)
  }
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

export {
  pipe, fork, assign,
  tap, tryCatch, switchCase,
  map, filter, reduce, transform, flatMap,
  any, all, and, or, not,
  eq, gt, lt, gte, lte,
  get, pick, omit,
}

export default {
  pipe, fork, assign,
  tap, tryCatch, switchCase,
  map, filter, reduce, transform, flatMap,
  any, all, and, or, not,
  eq, gt, lt, gte, lte,
  get, pick, omit,
}
