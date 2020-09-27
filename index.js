/**
 * rubico v1.5.19
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2020 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

(function (root, rubico) {
  if (typeof module == 'object') (module.exports = rubico) // CommonJS
  else if (typeof define == 'function') define(() => rubico) // AMD
  else (root.rubico = rubico) // Browser
}(typeof globalThis == 'object' ? globalThis : this, (function () {

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

'use strict'

const funcConcatSync = funcConcat.sync

const tacitGenericReduce = genericReduce.tacit

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

const isGeneratorFunction = value => objectToString(value) == generatorFunctionTag

const isAsyncGeneratorFunction = value => objectToString(value) == asyncGeneratorFunctionTag

const isNodeReadStream = value =>
  value != null && typeof value.pipe == 'function'

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

const arrayPush = (array, item) => array.push(item)

/**
 * @name asyncArrayReduce
 *
 * @synopsis
 * ```coffeescript [specscript]
 * asyncArrayReduce(
 *   array Array,
 *   reducer function,
 *   result any,
 *   index number,
 * ) -> result
 * ```
 */
const asyncArrayReduce = async function (array, reducer, result, index) {
  const arrayLength = array.length
  while (++index < arrayLength) {
    result = await reducer(result, array[index])
  }
  return result
}

/**
 * @name asyncIteratorReduce
 *
 * @synopsis
 * ```coffeescript [specscript]
 * asyncIteratorReduce(
 *   asyncIterator AsyncIterator<T>,
 *   reducer (any, T)=>Promise|any,
 *   result any,
 * ) -> result any
 * ```
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
 * ```coffeescript [specscript]
 * asyncGeneratorFunctionReduce(
 *   asyncGeneratorFunc ...args=>AsyncGenerator<T>,
 *   reducer (any, T)=>any,
 *   result any,
 * ) -> (...any args)=>any
 * ```
 */
const asyncGeneratorFunctionReduce = (
  asyncGeneratorFunc, reducer, result,
) => funcConcat(
  asyncGeneratorFunc,
  curry3(asyncIteratorReduce, __, reducer, result))

/**
 * @name generatorFunctionReduce
 *
 * @synopsis
 * ```coffeescript [specscript]
 * generatorFunctionReduce(
 *   generatorFunc ...args=>AsyncGenerator<T>,
 *   reducer (any, T)=>Promise|any,
 *   result any,
 * ) -> (...any args)=>any
 * ```
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
 * ```coffeescript [specscript]
 * reducerConcat(
 *   reducerA (any, T)=>(intermediate Promise|any),
 *   reducerB (intermediate, T)=>Promise|any,
 * ) -> pipedReducer (any, T)=>Promise|any
 * ```
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
 * @name reduce
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Foldable<T> = Iterable<T>|AsyncIterable<T>
 *   |{ reduce: (any, T)=>any }|Object<T>
 * Reducer<T> = (any, T)=>Promise|any
 * Transducer = Reducer=>Reducer
 *
 * reduce<T>(
 *   reducer Reducer<T>,
 *   init (collection=>Promise|any)|any?,
 * )(collection Foldable<T>) -> Promise|any
 *
 * reduce<args ...any>(
 *   reducer Reducer,
 *   init (...args=>Promise|any)|any?,
 * )(value GeneratorFunction|AsyncGeneratorFunction)
 *   -> reducingFunction ...args=>Promise|Semigroup|any
 *
 * reduce<args ...any>(
 *   reducer Reducer,
 *   init (...args=>Promise|any)|any?,
 * )(anotherReducer Reducer, moreReducers ...Reducer)
 *   -> chainedReducingFunction ...args=>Promise|any
 * ```
 *
 * @description
 * Execute a reducer for each item of a collection, resulting in a single output value.
 *
 * ```javascript [playground]
 * const max = (a, b) => a > b ? a : b
 *
 * console.log(
 *   reduce(max)([1, 3, 5, 4, 2]),
 * ) // 5
 * ```
 *
 * If an optional initialization parameter is supplied, the result starts as that parameter rather than the first item of the collection.
 *
 * ```javascript [playground]
 * const add = (a, b) => a + b
 *
 * console.log(
 *   reduce(add)([1, 2, 3, 4, 5], 0),
 * ) // 15
 * ```
 *
 * Note: For memory and performance, this library makes no assumptions about immutability. Exercise care when handling references for this initial value, as it could be mutated.
 *
 * If the initialization parameter is a function, it is treated as a resolver and called with the input arguments to resolve an initial value for the accumulator.
 *
 * ```javascript [playground]
 * const concatSquares = (array, value) => array.concat(value ** 2)
 *
 * const initEmptyArray = () => []
 *
 * console.log(
 *   reduce(concatSquares, initEmptyArray)([1, 2, 3, 4, 5]),
 * ) // [1, 4, 9, 16, 25]
 * ```
 *
 * Additionally, reducers can be asynchronous, while data parameters can be asynchronous streams.
 *
 * ```javascript [playground]
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
 * If the first argument to a reducing function is a reducer, `reduce` concatenates any reducers in argument position onto the initial reducer, producing a combined reducer that performs a chained operation per each item in a reducing operation.
 *
 * ```javascript [playground]
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
 * // state => state
 * const traceMiddleware = tap(
 *   (state, action) => console.log('state, action', state, action))
 *
 * const reducingABC = reduce(
 *   traceMiddleware, () => ({}))(reducerA, reducerB, reducerC)
 *
 * const actions = [{ type: 'A' }, { type: 'B' }, { type: 'C' }]
 *
 * console.log(
 *   'final state:',
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
  if (typeof init == 'function') {
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
 * ```coffeescript [specscript]
 * Reducer<T> = (any, T)=>Promise|any
 *
 * Transducer = Reducer=>Reducer
 *
 * emptyTransform(
 *   args Array,
 *   transducer Transducer,
 *   result any,
 * ) -> result
 * ```
 */
const emptyTransform = function (args, transducer, result) {
  const nil = genericReduce(args, transducer(identity), null)
  return isPromise(nil) ? nil.then(always(result)) : result
}

/**
 * @name _binaryExtend
 *
 * @synopsis
 * ```coffeescript [specscript]
 * _binaryExtend(
 *   typedArray TypedArray,
 *   array Array|TypedArray,
 * ) -> concatenatedTypedArray
 * ```
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
 * ```coffeescript [specscript]
 * binaryExtend(
 *   typedArray TypedArray,
 *   array Array|TypedArray|any,
 * ) -> concatenatedTypedArray
 * ```
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
 * ```coffeescript [specscript]
 * streamAppender(stream Writable) -> appender (
 *   chunk string|Buffer|Uint8Array|any,
 *   encoding string|undefined,
 *   callback function|undefined,
 * )=>stream
 * ```
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
 * ```coffeescript [specscript]
 * streamExtendExecutor(
 *   resultStream Writable, stream Readable,
 * ) -> executor (resolve function, reject function)=>()
 * ```
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
 * ```coffeescript [specscript]
 * _streamExtend(
 *   resultStream Writable, stream Readable,
 * ) -> writableStream
 * ```
 */
const _streamExtend = (
  resultStream, stream,
) => new Promise(streamExtendExecutor(resultStream, stream))

/**
 * @name streamExtend
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Writable = { write: function }
 *
 * Readable = { pipe: function }
 *
 * streamExtend(
 *   stream Writable,
 *   values Readable|any,
 * ) -> stream
 * ```
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
 * ```coffeescript [specscript]
 * callConcat(object Object, values any) -> object
 * ```
 */
const callConcat = function (object, values) {
  return object.concat(values)
}

/**
 * @name genericTransform
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Reducer<T> = (any, T)=>Promise|any
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
 * ```
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
 * @synopsis
 * ```coffeescript [specscript]
 * Reducer<T> = (any, T)=>Promise|any
 * Transducer = Reducer=>Reducer
 * Semigroup = Array|string|Set|TypedArray
 *   |{ concat: function }|{ write: function }|Object
 * Foldable = Iterable|AsyncIterable|{ reduce: function }|Object|any
 *
 * transform(
 *   transducer Transducer,
 *   init (collection=>Promise|Semigroup|any)|Semigroup|any,
 * )(collection Foldable)
 *   -> result Promise|Semigroup|any
 *
 * transform<args ...any>(
 *   transducer Transducer,
 *   init (...args=>Promise|Semigroup|any)|Semigroup|any,
 * )(value GeneratorFunction|AsyncGeneratorFunction)
 *   -> transformingFunction ...args=>Promise|Semigroup|any
 *
 * transform<args ...any>(
 *   transducer Transducer,
 *   init (...args=>Promise|Semigroup|any)|Semigroup|any,
 * )(reducer Reducer, moreReducers ...Reducer)
 *   -> chainedTransformingFunction ...args=>Promise|Semigroup|any
 * ```
 *
 * @description
 * Execute a transducer for each item of a collection, concatenating results into the accumulator. The initial value may be a function, in which case it is treated as a resolver.
 *
 * ```javascript [playground]
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
 * Any object that implements `.concat` can be transformed as a Semigroup.
 *
 * ```javascript [playground]
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
 * console.log(
 *   transform(
 *     map(Math.abs), new Max(-Infinity),
 *   )([-1, -2, -3, -4, -5]).number,
 * ) // 5
 * ```
 *
 * Node.js WritableStream interfaces are consumed as well.
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
 * `transform`, like `reduce`, supports reducer combination. This has a use case in state management, where for an aggregate state object, incoming values are concatenated (shallowly assigned).
 *
 * ```javascript [playground]
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
 *   map(logAction), // transducer middleware
 *   () => ({}),
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
 *
 * TODO explore Semigroup = Iterator|AsyncIterator
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

// a[0].b.c
const pathStringSplitRegex = /[.|[|\]]+/

/**
 * @name memoizedCappedPathStringSplit
 *
 * @synopsis
 * ```coffeescript [specscript]
 * memoizedCappedPathStringSplit(pathString string) -> Array<string>
 * ```
 *
 * @note
 * a[0].b.c
 * a.0.b[0][1].c
 */
const pathStringSplit = function (pathString) {
  const pathStringLastIndex = pathString.length - 1,
    firstChar = pathString[0],
    lastChar = pathString[pathStringLastIndex],
    isFirstCharLeftBracket = firstChar == '[',
    isLastCharRightBracket = lastChar == ']'

  if (isFirstCharLeftBracket && isLastCharRightBracket) {
    return pathString.slice(1, pathStringLastIndex).split(pathStringSplitRegex)
  } else if (isFirstCharLeftBracket) {
    return pathString.slice(1).split(pathStringSplitRegex)
  } else if (isLastCharRightBracket) {
    return pathString.slice(0, pathStringLastIndex).split(pathStringSplitRegex)
  }
  return pathString.split(pathStringSplitRegex)
}

// memoized version of pathStringSplit, max cache size 500
const memoizedCappedPathStringSplit = memoizeCappedUnary(pathStringSplit, 500)

/**
 * @name pathToArray
 *
 * @synopsis
 * ```coffeescript [specscript]
 * pathToArray(path Array|string|object)
 * ```
 */
const pathToArray = function (path) {
  if (typeof path == 'string' || path.constructor == String) {
    return memoizedCappedPathStringSplit(path)
  }
  if (isArray(path)) {
    return path
  }
  return [path]
}

/**
 * @name getByPath
 *
 * @synopsis
 * ```coffeescript [specscript]
 * getByPath(object Object, path string|Array|any) -> any
 * ```
 */
const getByPath = function (object, path) {
  const pathArray = pathToArray(path),
    pathArrayLength = pathArray.length
  let index = -1,
    result = object
  while (++index < pathArrayLength) {
    result = result[pathArray[index]]
    if (result == null) {
      return undefined
    }
  }
  return result
}

/**
 * @name get
 *
 * @synopsis
 * ```coffeescript [specscript]
 * get(
 *   path string|Array|any,
 *   defaultValue (object=>any)|any?,
 * )(object) -> result any
 * ```
 *
 * @description
 * Access properties on objects. `get(property)` creates a function that, when supplied an object, returns the value on the object associated with `property`.
 *
 * ```javascript [playground]
 * console.log(
 *   get('hello')({ hello: 'world' }),
 * ) // world
 * ```
 *
 * `get` accepts a default value to return if the property is not found. This default value may be a resolver of such value.
 *
 * ```javascript [playground]
 * console.log(
 *   get('hello', 'default')({ foo: 'bar' }),
 * ) // default
 *
 * console.log(
 *   get('hello', object => object.foo)({ foo: 'bar' }),
 * ) // bar
 * ```
 *
 * At times it is necessary to access nested properties. `get` supports nested property access for the following `path` patterns.
 *
 *  * a dot delimited string
 *  * bracket notation property access
 *  * an array of string keys or number indices
 *
 * ```javascript [playground]
 * const nestedABC0 = { a: { b: { c: ['hello'] } } }
 *
 * console.log(
 *   get('a.b.c[0]')(nestedABC0),
 * ) // hello
 *
 * const nested00000 = [[[[['foo']]]]]
 *
 * console.log(
 *   get('0.0.0.0.0')(nested00000),
 * ) // foo
 *
 * console.log(
 *   get('[0][0][0][0][0]')(nested00000),
 * ) // foo
 *
 * console.log(
 *   get([0, 0, 0, 0, 0])(nested00000),
 * ) // foo
 * ```
 */
const get = (path, defaultValue) => function getter(value) {
  const result = value == null ? undefined : getByPath(value, path)
  return result === undefined
    ? typeof defaultValue == 'function' ? defaultValue(value) : defaultValue
    : result
}

/**
 * @name pick
 *
 * @synopsis
 * ```coffeescript [specscript]
 * pick<T>(Array<string>)(source Object<T>) -> picked Object<T>
 * ```
 *
 * @description
 * Create a new object by including specific keys.
 *
 * ```javascript [playground]
 * console.log(
 *   pick(['hello', 'world'])({ goodbye: 1, world: 2 }),
 * ) // { world: 2 }
 * ```
 */
const pick = keys => function picking(source) {
  if (source == null) {
    return source
  }

  const keysLength = keys.length,
    result = {}
  let keysIndex = -1
  while (++keysIndex < keysLength) {
    const key = keys[keysIndex],
      value = source[key]
    if (value != null) {
      result[key] = value
    }
  }
  return result
}

/**
 * @name omit
 *
 * @synopsis
 * ```coffeescript [specscript]
 * omit<T>(Array<string>)(source Object<T>) -> omitted Object<T>
 * ```
 *
 * @description
 * Create a new object by excluding specific keys.
 *
 * ```javascript [playground]
 * console.log(
 *   omit(['_id'])({ _id: '1', name: 'George' }),
 * ) // { name: 'George' }
 * ```
 */
const omit = keys => function omitting(source) {
  if (source == null) {
    return source
  }

  const keysLength = keys.length,
    result = { ...source }
  let keysIndex = -1
  while (++keysIndex < keysLength) {
    delete result[keys[keysIndex]]
  }
  return result
}

/**
 * @name promiseInFlight
 *
 * @synopsis
 * ```coffeescript [specscript]
 * promiseInFlight(basePromise<T>) -> Promise<[T, basePromise<T>]>
 * ```
 */
const promiseInFlight = function (basePromise) {
  const promise = basePromise.then(res => [res, promise])
  return promise
}

/**
 * @name asyncArrayAny
 *
 * @synopsis
 * ```coffeescript [specscript]
 * asyncArrayAny(
 *   array Array,
 *   predicate any=>Promise|boolean,
 *   index number,
 *   promisesInFlight Set<Promise>,
 * ) -> boolean
 * ```
 */
const asyncArrayAny = async function (
  array, predicate, index, promisesInFlight,
) {
  const length = array.length

  while (++index < length) {
    const predication = predicate(array[index])
    if (isPromise(predication)) {
      promisesInFlight.add(promiseInFlight(predication))
    } else if (predication) {
      return true
    }
  }
  while (promisesInFlight.size > 0) {
    const [predication, promise] = await promiseRace(promisesInFlight)
    promisesInFlight.delete(promise)
    if (predication) {
      return true
    }
  }
  return false
}

/**
 * @name arrayAny
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayAny(
 *   array Array,
 *   predicate any=>Promise|boolean,
 * ) -> boolean
 * ```
 */
const arrayAny = function (array, predicate) {
  const length = array.length
  let index = -1
  while (++index < length) {
    const predication = predicate(array[index])
    if (isPromise(predication)) {
      return asyncArrayAny(
        array, predicate, index, new Set([promiseInFlight(predication)]))
    }
    if (predication) {
      return true
    }
  }
  return false
}

/**
 * @name asyncIteratorAny
 *
 * @synopsis
 * ```coffeescript [specscript]
 * asyncIteratorAny(
 *   iterator Iterator|AsyncIterator,
 *   predicate any=>Promise|boolean,
 *   index number,
 *   promisesInFlight Set<Promise>,
 *   maxConcurrency number=20,
 * ) -> boolean
 * ```
 */
const asyncIteratorAny = async function (
  iterator, predicate, promisesInFlight, maxConcurrency = 20,
) {
  let iteration = iterator.next()
  if (isPromise(iteration)) {
    iteration = await iteration
  }

  while (!iteration.done) {
    if (promisesInFlight.size >= maxConcurrency) {
      const [predication, promise] = await promiseRace(promisesInFlight)
      promisesInFlight.delete(promise)
      if (predication) {
        return true
      }
    }
    const predication = predicate(iteration.value)
    if (isPromise(predication)) {
      promisesInFlight.add(promiseInFlight(predication))
    } else if (predication) {
      return true
    }
    iteration = iterator.next()
    if (isPromise(iteration)) {
      iteration = await iteration
    }
  }
  while (promisesInFlight.size > 0) {
    const [predication, promise] = await promiseRace(promisesInFlight)
    promisesInFlight.delete(promise)
    if (predication) {
      return true
    }
  }
  return false
}

/**
 * @name iteratorAny
 *
 * @synopsis
 * ```coffeescript [specscript]
 * iteratorAny(
 *   iterator Iterator,
 *   predicate any=>Promise|boolean,
 * ) -> boolean
 * ```
 */
const iteratorAny = function (iterator, predicate) {
  for (const item of iterator) {
    const predication = predicate(item)
    if (isPromise(predication)) {
      return asyncIteratorAny(
        iterator, predicate, new Set([promiseInFlight(predication)]))
    }
    if (predication) {
      return true
    }
  }
  return false
}

/**
 * @name objectValuesGenerator
 *
 * @synopsis
 * ```coffeescript [specscript]
 * objectValuesGenerator(object Object<T>) -> Generator<T>
 * ```
 */
const objectValuesGenerator = function* (object) {
  for (const key in object) {
    yield object[key]
  }
}


/**
 * @name _foldableAnyReducer
 *
 * @synopsis
 * ```coffeescript [specscript]
 * _foldableAnyReducer(predicate any=> boolean, result boolean, item any) -> boolean
 * ```
 */
const _foldableAnyReducer = (predicate, result, item) => result ? true : predicate(item)

/**
 * @name foldableAnyReducer
 *
 * @synopsis
 * ```coffeescript [specscript]
 * foldableAnyReducer(
 *   predicate any=>boolean,
 * ) -> reducer(result boolean, item any)=>boolean
 * ```
 *
 * @related foldableAllReducer
 */
const foldableAnyReducer = predicate => function anyReducer(result, item) {
  return result === true ? true
    : isPromise(result) ? result.then(
      curry3(_foldableAnyReducer, predicate, __, item))
    : result ? true : predicate(item)
}

/**
 * @name any
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Foldable<T> = Iterable<T>|AsyncIterable<T>
 *   |{ reduce: (any, T)=>any }|Object<T>
 *
 * any<T>(
 *   predicate T=>Promise|boolean
 * )(value Foldable<T>) -> anyTruthyByPredicate Promise|boolean
 * ```
 *
 * @description
 * Test a predicate concurrently across all items of a collection, returning true if any predication is truthy.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * console.log(
 *   any(isOdd)([1, 2, 3, 4, 5]),
 * ) // true
 * ```
 *
 * The predicate may return a Promise, while the value may be an asynchronous stream.
 *
 * ```javascript [playground]
 * const toTodosUrl = id => 'https://jsonplaceholder.typicode.com/todos/' + id
 *
 * const fetchedToJson = fetched => fetched.json()
 *
 * const fetchTodo = pipe([
 *   toTodosUrl,
 *   fetch,
 *   fetchedToJson,
 * ])
 *
 * const todoIDsGenerator = async function* () {
 *   yield 1; yield 2; yield 3; yield 4; yield 5
 * }
 *
 * any(pipe([
 *   fetchTodo,
 *   todo => todo.title.startsWith('fugiat'),
 * ]))(todoIDsGenerator()).then(console.log) // true
 * ```
 *
 * @execution concurrent
 *
 * @muxing
 *
 * @related or
 */
const any = predicate => function anyTruthy(value) {
  if (isArray(value)) {
    return arrayAny(value, predicate)
  }
  if (value == null) {
    return predicate(value)
  }
  if (typeof value[symbolIterator] == 'function') {
    return iteratorAny(value[symbolIterator](), predicate)
  }
  if (typeof value[symbolAsyncIterator] == 'function') {
    return asyncIteratorAny(value[symbolAsyncIterator](), predicate, new Set())
  }
  if (typeof value.reduce == 'function') {
    return value.reduce(foldableAnyReducer(predicate), false)
  }
  if (value.constructor == Object) {
    return iteratorAny(objectValuesGenerator(value), predicate)
  }
  return !!predicate(value)
}

/**
 * @name arrayAll
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayAll(array Array, predicate ...any=>boolean) -> boolean
 * ```
 */
const arrayAll = function (array, predicate) {
  const arrayLength = array.length,
    promises = []
  let index = -1
  while (++index < arrayLength) {
    const predication = predicate(array[index])
    if (isPromise(predication)) {
      promises.push(predication)
    } else if (!predication) {
      return false
    }
  }
  return promises.length == 0
    ? true
    : promiseAll(promises).then(curry3(callPropUnary, __, 'every', Boolean))
}

/**
 * @name iteratorAll
 *
 * @synopsis
 * ```coffeescript [specscript]
 * iteratorAll(iterator Iterator, predicate ...any=>boolean) -> boolean
 * ```
 */
const iteratorAll = function (iterator, predicate) {
  const promises = []
  for (const item of iterator) {
    const predication = predicate(item)
    if (isPromise(predication)) {
      promises.push(predication)
    } else if (!predication) {
      return false
    }
  }
  return promises.length == 0
    ? true
    : promiseAll(promises).then(curry3(callPropUnary, __, 'every', Boolean))
}

/**
 * @name asyncIteratorAll
 *
 * @synopsis
 * ```coffeescript [specscript]
 * asyncIteratorAll(asyncIterator AsyncIterator, predicate ...any=>boolean) -> boolean
 * ```
 *
 * @related asyncIteratorAny
 */
const asyncIteratorAll = async function (
  iterator, predicate, promisesInFlight, maxConcurrency = 20,
) {
  let iteration = iterator.next()
  if (isPromise(iteration)) {
    iteration = await iteration
  }

  while (!iteration.done) {
    if (promisesInFlight.size >= maxConcurrency) {
      const [predication, promise] = await promiseRace(promisesInFlight)
      promisesInFlight.delete(promise)
      if (!predication) {
        return false
      }
    }
    const predication = predicate(iteration.value)
    if (isPromise(predication)) {
      promisesInFlight.add(promiseInFlight(predication))
    } else if (!predication) {
      return false
    }
    iteration = iterator.next()
    if (isPromise(iteration)) {
      iteration = await iteration
    }
  }
  while (promisesInFlight.size > 0) {
    const [predication, promise] = await promiseRace(promisesInFlight)
    promisesInFlight.delete(promise)
    if (!predication) {
      return false
    }
  }
  return true
}

/**
 * @name _foldableAllReducer
 *
 * @synopsis
 * ```coffeescript [specscript]
 * _foldableAllReducer(predicate any=> boolean, result boolean, item any) -> boolean
 * ```
 */
const _foldableAllReducer = (predicate, result, item) => result ? predicate(item) : false

/**
 * @name foldableAllReducer
 *
 * @synopsis
 * ```coffeescript [specscript]
 * foldableAllReducer(
 *   predicate any=>boolean,
 * ) -> reducer(result boolean, item any)=>boolean
 * ```
 *
 * @related foldableAnyReducer
 */
const foldableAllReducer = predicate => function allReducer(result, item) {
  return result === false ? false
    : isPromise(result) ? result.then(
      curry3(_foldableAllReducer, predicate, __, item))
    : result ? predicate(item) : false
}

/**
 * @name all
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Foldable<T> = Iterable<T>|AsyncIterable<T>
 *   |{ reduce: (any, T)=>any }|Object<T>
 *
 * all<T>(
 *   predicate T=>Promise|boolean,
 * )(value Foldable<T>) -> allTruthyByPredicate Promise|boolean
 * ```
 *
 * @description
 * Test a predicate concurrently across all items of a collection, returning true if all predications are truthy.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * console.log(
 *   all(isOdd)([1, 2, 3, 4, 5]),
 * ) // false
 *
 * console.log(
 *   all(isOdd)([1, 3, 5]),
 * ) // true
 * ```
 *
 * The predicate may return a Promise, while the value may be an asynchronous stream.
 *
 * ```javascript [playground]
 * const asyncNumbers = async function* () {
 *   yield 1; yield 2; yield 3; yield 4; yield 5
 * }
 *
 * all(async number => number < 6)(asyncNumbers()).then(console.log) // true
 * ```
 *
 * @execution concurrent
 *
 * @muxing
 */
const all = predicate => function allTruthy(value) {
  if (isArray(value)) {
    return arrayAll(value, predicate)
  }
  if (value == null) {
    return predicate(value)
  }

  if (typeof value[symbolIterator] == 'function') {
    return iteratorAll(value, predicate)
  }
  if (typeof value[symbolAsyncIterator] == 'function') {
    return asyncIteratorAll(value, predicate, new Set())
  }
  if (typeof value.reduce == 'function') {
    return value.reduce(foldableAllReducer(predicate), true)
  }
  if (value.constructor == Object) {
    return iteratorAll(objectValuesGenerator(value), predicate)
  }
  return !!predicate(value)
}

// true -> false
const _not = value => !value

/**
 * @name not
 *
 * @synopsis
 * ```coffeescript [specscript]
 * not(
 *   predicate ...any=>Promise|boolean,
 * ) -> invertedPredicate ...any=>Promise|boolean
 * ```
 *
 * @description
 * Logically invert a predicate (`!`) by always logically inverting its return value. Predicate may be asynchronous.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * console.log(
 *   not(isOdd)(3),
 * ) // false
 * ```
 */
const not = func => function logicalInverter(...args) {
  const boolean = func(...args)
  return isPromise(boolean) ? boolean.then(_not) : !boolean
}

/**
 * @name notSync
 *
 * @synopsis
 * ```coffeescript [specscript]
 * notSync(func ...any=>boolean) -> logicallyInverted ...any=>boolean
 * ```
 */
const notSync = func => function notSync(...args) {
  return !func(...args)
}

/**
 * @name not.sync
 *
 * @synopsis
 * ```coffeescript [specscript]
 * not.sync<args ...any>(
 *   predicate ...args=>boolean,
 * ) -> logicallyInverted ...args=>boolean
 * ```
 *
 * @description
 * Logically invert a function without promise handling.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * console.log(
 *   not.sync(isOdd)(2),
 * ) // true
 * ```
 */
not.sync = notSync

/**
 * @name asyncAnd
 *
 * @synopsis
 * ```coffeescript [specscript]
 * asyncAnd(
 *   predicates Array<value=>Promise|boolean>
 *   value any,
 * ) -> allTruthy boolean
 * ```
 */
const asyncAnd = async function (predicates, value) {
  const length = predicates.length
  let index = -1
  while (++index < length) {
    let predication = predicates[index](value)
    if (isPromise(predication)) {
      predication = await predication
    }
    if (!predication) {
      return false
    }
  }
  return true
}

// handles the first predication before asyncAnd
const _asyncAndInterlude = (
  predicates, value, firstPredication,
) => firstPredication ? asyncAnd(predicates, value) : false

/**
 * @name and
 *
 * @synopsis
 * ```coffeescript [specscript]
 * and(
 *   predicates Array<value=>Promise|boolean>
 * )(value any) -> allTruthy Promise|boolean
 * ```
 *
 * @description
 * Test an array of predicates concurrently against a single input, returning true if all are truthy. Predicates may be asynchronous.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * const isPositive = number => number > 0
 *
 * const isLessThan3 = number => number < 3
 *
 * console.log(
 *   and([isOdd, isPositive, isLessThan3])(1),
 * ) // true
 * ```
 *
 * @execution serial
 *
 * @note ...args slows down here by an order of magnitude
 */
const and = predicates => function allPredicates(value) {
  const length = predicates.length,
    promises = []
  let index = -1

  while (++index < length) {
    const predication = predicates[index](value)
    if (isPromise(predication)) {
      return predication.then(curry3(_asyncAndInterlude, predicates, value, __))
    }
    if (!predication) {
      return false
    }
  }
  return true
}

/**
 * @name asyncOr
 *
 * @synopsis
 * ```coffeescript [specscript]
 * asyncOr(
 *   predicates Array<value=>Promise|boolean>
 *   value any,
 * ) -> allTruthy boolean
 * ```
 */
const asyncOr = async function (predicates, value) {
  const length = predicates.length
  let index = -1
  while (++index < length) {
    let predication = predicates[index](value)
    if (isPromise(predication)) {
      predication = await predication
    }
    if (predication) {
      return true
    }
  }
  return false
}

// handles the first predication before asyncOr
const _asyncOrInterlude = (
  predicates, value, firstPredication,
) => firstPredication ? true : asyncOr(predicates, value)

/**
 * @name or
 *
 * @synopsis
 * ```coffeescript [specscript]
 * or(
 *   predicates Array<value=>Promise|boolean>
 * )(value any) -> anyTruthy Promise|boolean
 * ```
 *
 * @description
 * Test an array of predicates concurrently against a single input, returning true if any of them test truthy. Predicates may be asynchronous.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * const isEven = number => number % 2 == 0
 *
 * console.log(
 *   or([isOdd, isEven])(0),
 * ) // true
 * ```
 *
 * @execution series
 *
 * @note ...args slows down here by an order of magnitude
 */
const or = predicates => function anyPredicates(value) {
  const length = predicates.length
  let index = -1

  while (++index < length) {
    const predication = predicates[index](value)
    if (isPromise(predication)) {
      return predication.then(curry3(_asyncOrInterlude, predicates, value, __))
    }
    if (predication) {
      return true
    }
  }
  return false
}

/**
 * @name spread2
 *
 * @synopsis
 * ```coffeescript [specscript]
 * spread2(func function) -> spreading2 (
 *   arg0 any, arg1 any,
 * )=>func(arg0, arg1)
 * ```
 */
const spread2 = func => function spreading2([arg0, arg1]) {
  return func(arg0, arg1)
}

/**
 * @name strictEqual
 *
 * @synopsis
 * ```coffeescript [specscript]
 * strictEqual(a any, b any) -> boolean
 * ```
 */
const strictEqual = (a, b) => a === b

/**
 * @name eq
 *
 * @synopsis
 * ```coffeescript [specscript]
 * eq(
 *   left (any=>Promise|boolean)|any,
 *   right (any=>Promise|boolean)|any,
 * ) -> strictEqualBy (value any)=>Promise|boolean
 * ```
 *
 * @description
 * Test for strict equality (`===`) between two values. Either parameter may be an asynchronous resolver.
 *
 * ```javascript [playground]
 * const personIsGeorge = eq(person => person.name, 'George')
 *
 * console.log(
 *   personIsGeorge({ name: 'George', likes: 'bananas' }),
 * ) // true
 * ```
 *
 * @execution concurrent
 */
const eq = function (left, right) {
  const isLeftResolver = typeof left == 'function',
    isRightResolver = typeof right == 'function'
  if (isLeftResolver && isRightResolver) {
    return function strictEqualBy(value) {
      const leftResolve = left(value),
        rightResolve = right(value)
      const isLeftPromise = isPromise(leftResolve),
        isRightPromise = isPromise(rightResolve)
      if (isLeftPromise && isRightPromise) {
        return promiseAll(
          [leftResolve, rightResolve]).then(spread2(strictEqual))
      } else if (isLeftPromise) {
        return leftResolve.then(curry2(strictEqual, __, rightResolve))
      } else if (isRightPromise) {
        return rightResolve.then(curry2(strictEqual, leftResolve, __))
      }
      return leftResolve === rightResolve
    }
  }

  if (isLeftResolver) {
    return function strictEqualBy(value) {
      const leftResolve = left(value)
      return isPromise(leftResolve)
        ? leftResolve.then(curry2(strictEqual, __, right))
        : leftResolve === right
    }
  }
  if (isRightResolver) {
    return function strictEqualBy(value) {
      const rightResolve = right(value)
      return isPromise(rightResolve)
        ? rightResolve.then(curry2(strictEqual, left, __))
        : left === rightResolve
    }
  }
  return always(left === right)
}

/**
 * @name greaterThan
 *
 * @synopsis
 * ```coffeescript [specscript]
 * greaterThan(left any, right any) -> boolean
 * ```
 */
const greaterThan = (left, right) => left > right

/**
 * @name gt
 *
 * @synopsis
 * ```coffeescript [specscript]
 * gt(
 *   left (any=>Promise|boolean)|any,
 *   right (any=>Promise|boolean)|any,
 * )(value any) -> greaterThanBy(value any)=>Promise|boolean
 * ```
 *
 * @description
 * Test for left value greater than (`>`) right value. Either parameter may be an asynchronous resolver.
 *
 * ```javascript [playground]
 * const isOfLegalAge = gt(21, person => person.age)
 *
 * const juvenile = { age: 16 }
 *
 * console.log(isOfLegalAge(juvenile)) // false
 * ```
 */
const gt = function (left, right) {
  const isLeftResolver = typeof left == 'function',
    isRightResolver = typeof right == 'function'
  if (isLeftResolver && isRightResolver) {
    return function greaterThanBy(value) {
      const leftResolve = left(value),
        rightResolve = right(value)
      const isLeftPromise = isPromise(leftResolve),
        isRightPromise = isPromise(rightResolve)
      if (isLeftPromise && isRightPromise) {
        return promiseAll(
          [leftResolve, rightResolve]).then(spread2(greaterThan))
      } else if (isLeftPromise) {
        return leftResolve.then(curry2(greaterThan, __, rightResolve))
      } else if (isRightPromise) {
        return rightResolve.then(curry2(greaterThan, leftResolve, __))
      }
      return leftResolve > rightResolve
    }
  }

  if (isLeftResolver) {
    return function greaterThanBy(value) {
      const leftResolve = left(value)
      return isPromise(leftResolve)
        ? leftResolve.then(curry2(greaterThan, __, right))
        : leftResolve > right
    }
  }
  if (isRightResolver) {
    return function strictEqualBy(value) {
      const rightResolve = right(value)
      return isPromise(rightResolve)
        ? rightResolve.then(curry2(greaterThan, left, __))
        : left > rightResolve
    }
  }
  return always(left > right)
}

/**
 * @name lessThan
 *
 * @synopsis
 * ```coffeescript [specscript]
 * lessThan(left any, right any) -> boolean
 * ```
 */
const lessThan = (left, right) => left < right

/**
 * @name lt
 *
 * @synopsis
 * ```coffeescript [specscript]
 * lt(
 *   left (any=>Promise|boolean)|any,
 *   right (any=>Promise|boolean)|any,
 * )(value any) -> lessThanBy(value any)=>Promise|boolean
 * ```
 *
 * @description
 * Test for left value less than (`<`) right value. Either parameter may be an asynchronous resolver.
 *
 * ```javascript [playground]
 * const identity = value => value
 *
 * const isLessThan3 = lt(identity, 3)
 *
 * console.log(isLessThan3(1), true)
 * console.log(isLessThan3(3), false)
 * console.log(isLessThan3(5), false)
 * ```
 */
const lt = function (left, right) {
  const isLeftResolver = typeof left == 'function',
    isRightResolver = typeof right == 'function'
  if (isLeftResolver && isRightResolver) {
    return function lessThanBy(value) {
      const leftResolve = left(value),
        rightResolve = right(value)
      const isLeftPromise = isPromise(leftResolve),
        isRightPromise = isPromise(rightResolve)
      if (isLeftPromise && isRightPromise) {
        return promiseAll(
          [leftResolve, rightResolve]).then(spread2(lessThan))
      } else if (isLeftPromise) {
        return leftResolve.then(curry2(lessThan, __, rightResolve))
      } else if (isRightPromise) {
        return rightResolve.then(curry2(lessThan, leftResolve, __))
      }
      return leftResolve < rightResolve
    }
  }

  if (isLeftResolver) {
    return function lessThanBy(value) {
      const leftResolve = left(value)
      return isPromise(leftResolve)
        ? leftResolve.then(curry2(lessThan, __, right))
        : leftResolve < right
    }
  }
  if (isRightResolver) {
    return function strictEqualBy(value) {
      const rightResolve = right(value)
      return isPromise(rightResolve)
        ? rightResolve.then(curry2(lessThan, left, __))
        : left < rightResolve
    }
  }
  return always(left < right)
}

/**
 * @name greaterThanOrEqualTo
 *
 * @synopsis
 * ```coffeescript [specscript]
 * greaterThanOrEqualTo(left any, right any) -> boolean
 * ```
 */
const greaterThanOrEqualTo = (left, right) => left >= right

/**
 * @name gte
 *
 * @synopsis
 * ```coffeescript [specscript]
 * gte(
 *   left (any=>Promise|boolean)|any,
 *   right (any=>Promise|boolean)|any,
 * )(value any) -> greaterThanOrEqualToBy(value any)=>Promise|boolean
 * ```
 *
 * @description
 * Test for left value greater than or equal to (`>=`) right value. Either parameter may be an asynchronous resolver.
 *
 * ```javascript [playground]
 * const identity = value => value
 *
 * const isAtLeast100 = gte(identity, 100)
 *
 * console.log(isAtLeast100(99)) // false
 * console.log(isAtLeast100(100)) // true
 * console.log(isAtLeast100(101)) // true
 * ```
 */
const gte = function (left, right) {
  const isLeftResolver = typeof left == 'function',
    isRightResolver = typeof right == 'function'
  if (isLeftResolver && isRightResolver) {
    return function greaterThanOrEqualToBy(value) {
      const leftResolve = left(value),
        rightResolve = right(value)
      const isLeftPromise = isPromise(leftResolve),
        isRightPromise = isPromise(rightResolve)
      if (isLeftPromise && isRightPromise) {
        return promiseAll(
          [leftResolve, rightResolve]).then(spread2(greaterThanOrEqualTo))
      } else if (isLeftPromise) {
        return leftResolve.then(curry2(greaterThanOrEqualTo, __, rightResolve))
      } else if (isRightPromise) {
        return rightResolve.then(curry2(greaterThanOrEqualTo, leftResolve, __))
      }
      return leftResolve >= rightResolve
    }
  }

  if (isLeftResolver) {
    return function greaterThanOrEqualToBy(value) {
      const leftResolve = left(value)
      return isPromise(leftResolve)
        ? leftResolve.then(curry2(greaterThanOrEqualTo, __, right))
        : leftResolve >= right
    }
  }
  if (isRightResolver) {
    return function strictEqualBy(value) {
      const rightResolve = right(value)
      return isPromise(rightResolve)
        ? rightResolve.then(curry2(greaterThanOrEqualTo, left, __))
        : left >= rightResolve
    }
  }
  return always(left >= right)
}

/**
 * @name lessThanOrEqualTo
 *
 * @synopsis
 * ```coffeescript [specscript]
 * lessThanOrEqualTo(left any, right any) -> boolean
 * ```
 */
const lessThanOrEqualTo = (left, right) => left <= right

/**
 * @name lte
 *
 * @synopsis
 * ```coffeescript [specscript]
 * lte(
 *   left (any=>Promise|boolean)|any,
 *   right (any=>Promise|boolean)|any,
 * )(value any) -> lessThanBy(value any)=>Promise|boolean
 * ```
 *
 * @description
 * Test for left value less than or equal to (`<=`) right value. Either parameter may be an asynchronous resolver.
 *
 * ```javascript [playground]
 * const identity = value => value
 *
 * const isLessThanOrEqualTo3 = lte(identity, 3)
 *
 * console.log(isLessThanOrEqualTo3(1), true)
 * console.log(isLessThanOrEqualTo3(3), true)
 * console.log(isLessThanOrEqualTo3(5), false)
 * ```
 */
const lte = function (left, right) {
  const isLeftResolver = typeof left == 'function',
    isRightResolver = typeof right == 'function'
  if (isLeftResolver && isRightResolver) {
    return function lessThanBy(value) {
      const leftResolve = left(value),
        rightResolve = right(value)
      const isLeftPromise = isPromise(leftResolve),
        isRightPromise = isPromise(rightResolve)
      if (isLeftPromise && isRightPromise) {
        return promiseAll(
          [leftResolve, rightResolve]).then(spread2(lessThanOrEqualTo))
      } else if (isLeftPromise) {
        return leftResolve.then(curry2(lessThanOrEqualTo, __, rightResolve))
      } else if (isRightPromise) {
        return rightResolve.then(curry2(lessThanOrEqualTo, leftResolve, __))
      }
      return leftResolve <= rightResolve
    }
  }

  if (isLeftResolver) {
    return function lessThanBy(value) {
      const leftResolve = left(value)
      return isPromise(leftResolve)
        ? leftResolve.then(curry2(lessThanOrEqualTo, __, right))
        : leftResolve <= right
    }
  }
  if (isRightResolver) {
    return function strictEqualBy(value) {
      const rightResolve = right(value)
      return isPromise(rightResolve)
        ? rightResolve.then(curry2(lessThanOrEqualTo, left, __))
        : left <= rightResolve
    }
  }
  return always(left <= right)
}

return {
  pipe, fork, assign,
  tap, tryCatch, switchCase,
  map, filter, reduce, transform, flatMap,
  any, all, and, or, not,
  eq, gt, lt, gte, lte,
  get, pick, omit,
}

}())))
