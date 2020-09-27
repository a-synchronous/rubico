const __ = require('./_internal/placeholder')
const curry2 = require('./_internal/curry2')
const funcConcat = require('./_internal/funcConcat')
const genericReduce = require('./_internal/genericReduce')
const arrayFlatten = require('./_internal/arrayFlatten')

const tacitGenericReduce = genericReduce.tacit

const symbolIterator = Symbol.iterator

const symbolAsyncIterator = Symbol.asyncIterator

const isArray = Array.isArray

const isFunction = value => typeof value == 'function'

const generatorFunctionTag = '[object GeneratorFunction]'

const asyncGeneratorFunctionTag = '[object AsyncGeneratorFunction]'

const isBinary = ArrayBuffer.isView

const objectProto = Object.prototype

const nativeObjectToString = objectProto.toString

const objectToString = x => nativeObjectToString.call(x)

const isAsyncGeneratorFunction = value => objectToString(value) == asyncGeneratorFunctionTag

const isGeneratorFunction = value => objectToString(value) == generatorFunctionTag

/**
 * @name flatteningTransducer
 *
 * @synopsis
 * ```coffeescript [specscript]
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
 * ```
 *
 * @execution series
 */
const flatteningTransducer = concat => function flatteningReducer(
  result, item,
) {
  return genericReduce([item], concat, result)
}

/**
 * @name arrayFlatMap
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
 * arrayFlatMap(
 *   array Array,
 *   flatMapper item=>Promise|Monad|Foldable|any,
 * ) -> Array
 * ```
 */
const arrayFlatMap = function (array, flatMapper) {
  const monadArray = arrayMap(array, flatMapper)
  return isPromise(monadArray)
    ? monadArray.then(arrayFlatten)
    : arrayFlatten(monadArray)
}

/**
 * @name monadObjectFlatten
 *
 * @synopsis
 * ```coffeescript [specscript]
 * monadObjectFlatten(object Object) -> Object
 * ```
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
 * ```coffeescript [specscript]
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
 * ```
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
 * @name setFlatMap
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
 * setFlatMap(
 *   set Set,
 *   flatMapper item=>Promise|Monad|Foldable|any,
 * ) -> Set
 * ```
 */
const setFlatMap = function (set, flatMapper) {
  const monadSet = setMap(set, flatMapper)
  return isPromise(monadSet)
    ? monadSet.then(setFlatten)
    : setFlatten(monadSet)
}

/**
 * @name arrayJoin
 *
 * @synopsis
 * ```coffeescript [specscript]
 * arrayJoin(array Array, delimiter string) -> string
 * ```
 */
const arrayJoin = (array, delimiter) => array.join(delimiter)

/**
 * @name monadArrayFlattenToString
 *
 * @synopsis
 * ```coffeescript [specscript]
 * monadArrayFlattenToString(
 *   array Array<Monad|Foldable|any>,
 * ) -> string
 * ```
 */
const monadArrayFlattenToString = funcConcat(
  arrayFlatten, curry2(arrayJoin, __, ''))

/**
 * @name stringFlatMap
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
 * stringFlatMap(
 *   string,
 *   flatMapper item=>Promise|Monad|Foldable|any,
 * ) -> string
 * ```
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
 * ```coffeescript [specscript]
 * streamWrite(
 *   stream Writable,
 *   chunk string|Buffer|Uint8Array|any,
 *   encoding string|undefined,
 *   callback function|undefined,
 * ) -> stream
 * ```
 */
const streamWrite = function (stream, chunk, encoding, callback) {
  stream.write(chunk, encoding, callback)
  return stream
}

/**
 * @name streamFlatten
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Monad = Array|String|Set
 *   |TypedArray|DuplexStream|Iterator|AsyncIterator
 *   |{ chain: function }|{ flatMap: function }|Object
 *
 * Foldable = Iterable|AsyncIterable|{ reduce: function }
 *
 * streamFlatExtend(stream DuplexStream, item Monad|Foldable|any) -> stream
 * ```
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
 * ```coffeescript [specscript]
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
 * ```
 *
 * @related arrayFlatten
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
 * ```coffeescript [specscript]
 * arrayJoinToBinary(array Array, init TypedArray|Buffer) -> TypedArray|Buffer
 * ```
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
 * ```coffeescript [specscript]
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
 * ```
 */
const monadArrayFlattenToBinary = function (array, result) {
  const flattened = arrayFlatten(array)
  return isPromise(flattened)
    ? flattened.then(curry2(arrayJoinToBinary, __, result))
    : arrayJoinToBinary(flattened, result)
}

/**
 * @name binaryFlatMap
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
 * binaryFlatMap(
 *   stream DuplexStream,
 *   flatMapper item=>Promise|Monad|Foldable|any,
 * ) -> stream
 * ```
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
 * ```coffeescript [specscript]
 * generatorFunctionFlatMap(
 *   generatorFunction GeneratorFunction,
 *   flatMapper item=>Promise|Monad|Foldable|any,
 * ) -> flatMappingGeneratorFunction GeneratorFunction
 * ```
 */
const generatorFunctionFlatMap = (
  generatorFunction, flatMapper,
) => function* flatMappingGeneratorFunction(...args) {
  yield* new FlatMappingIterator(generatorFunction(...args), flatMapper)
}

/**
 * @name reducerFlatMap
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
 * reducerFlatMap(
 *   reducer (any, T)=>Promise|any,
 *   flatMapper item=>Promise|Monad|Foldable|any,
 * )
 * ```
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
 * @synopsis
 * ```coffeescript [specscript]
 * new FlatMappingIterator(
 *   iterator Iterator, flatMapper function,
 * ) -> FlatMappingIterator { next, SymbolIterator }
 * ```
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

  /**
   * @name FlatMappingIterator.prototype.next
   *
   * @synopsis
   * ```coffeescript [specscript]
   * new FlatMappingIterator(
   *   iterator Iterator, flatMapper function
   * ).next() -> { value: any, done: boolean }
   * ```
   */
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
    const monadAsArray = genericReduce(
      [this.flatMapper(iteration.value)],
      arrayPush,
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
 * ```coffeescript [specscript]
 * new FlatMappingAsyncIterator(
 *   asyncIterator AsyncIterator, flatMapper function,
 * ) -> FlatMappingAsyncIterator AsyncIterator
 * ```
 *
 * @execution concurrent
 *
 * @muxing
 */
const FlatMappingAsyncIterator = function (asyncIterator, flatMapper) {
  this.asyncIterator = asyncIterator
  this.flatMapper = flatMapper
  this.buffer = []
  this.bufferIndex = 0
  this.promises = new Set()
}

FlatMappingAsyncIterator.prototype = {
  [symbolAsyncIterator]() {
    return this
  },

  toString() {
    return '[object FlatMappingAsyncIterator]'
  },

  /**
   * @name FlatMappingAsyncIterator.prototype.next
   *
   * @synopsis
   * ```coffeescript [specscript]
   * new FlatMappingAsyncIterator(
   *   asyncIterator AsyncIterator, flatMapper function,
   * ).next() -> Promise<{ value, done }>
   * ```
   *
   * @note
   * Promises
   * 1. asyncIterator.next() -> { value, done }
   * 2. flatMapper(value) -> monad
   * 3. flatten operation -> deferred promise set
   */
  async next() {
    const { buffer, bufferIndex } = this
    if (bufferIndex < buffer.length) {
      const value = buffer[bufferIndex]
      delete buffer[bufferIndex]
      this.bufferIndex += 1
      return { value, done: false }
    }

    const iteration = await this.asyncIterator.next()
    if (iteration.done) {
      if (this.promises.size == 0) {
        return iteration
      }
      await promiseRace(this.promises)
      return this.next()
    }
    let monad = this.flatMapper(iteration.value)
    if (isPromise(monad)) {
      monad = await monad
    }
    // this will always load at least one item
    const bufferLoading = genericReduce([monad], arrayPush, this.buffer)
    if (isPromise(bufferLoading)) {
      const promise = bufferLoading.then(() => this.promises.delete(promise))
      this.promises.add(promise)
    }
    return this.next()
  },
}

/**
 * @name asyncGeneratorFunctionFlatMap
 *
 * @synopsis
 * ```coffeescript [specscript]
 * asyncGeneratorFunctionFlatMap(
 *   generatorFunction GeneratorFunction,
 *   flatMapper item=>Promise|Monad|Foldable|any,
 * ) -> flatMappingAsyncGeneratorFunction GeneratorFunction
 * ```
 *
 * @related streamFlatMap
 */
const asyncGeneratorFunctionFlatMap = (
  asyncGeneratorFunction, flatMapper,
) => async function* flatMappingAsyncGeneratorFunction(...args) {
  yield* new FlatMappingAsyncIterator(
    asyncGeneratorFunction(...args), flatMapper)
}

/**
 * @name flatMap
 *
 * @synopsis
 * ```coffeescript [specscript]
 * DuplexStream = { read: function, write: function }
 * Monad = Array|String|Set
 *   |TypedArray|DuplexStream|Iterator|AsyncIterator
 *   |{ chain: function }|{ flatMap: function }|Object
 * Foldable = Iterable|AsyncIterable|{ reduce: function }
 * Reducer<T> = (any, T)=>Promise|any
 *
 * flatMap<T>(
 *   flatMapper T=>Promise|Monad|Foldable|any,
 * )(value Monad<T>) -> result Monad
 *
 * flatMap<T>(
 *   flatMapper T=>Promise|Monad|Foldable|any,
 * )(value GeneratorFunction<T>|AsyncGeneratorFunction<T>)
 *   -> flatMappingGeneratorFunction GeneratorFunction<T>|AsyncGeneratorFunction<T>
 *
 * flatMap<T>(
 *   flatMapper T=>Promise|Monad|Foldable|any,
 * )(value Reducer<T>) -> flatMappingReducer Reducer
 * ```
 *
 * @description
 * Apply a function to each item of a collection, flattening any resulting collection. The result is always the same type as the input value with all items mapped and flattened. The following outlines behavior for various collections.
 *
 *   * `Array` - map items then flatten results into a new `Array`
 *   * `String|string` - map items then flatten (`+`) results into a new `string`
 *   * `Set` - map items then flatten results into a new `Set`
 *   * `TypedArray` - map items then flatten results into a new `TypedArray`
 *   * `Buffer (Node.js)` - map items then flatten results into a new `Buffer`
 *   * `stream.Duplex (Node.js)` - map over stream items by async iteration, then call stream's `.write` to flatten
 *   * `{ chain: function }`, i.e. object that implements `.chain` - this function is called directly
 *   * `{ flatMap: function }`, i.e. object that implements `.flatMap` - this function is called directly
 *   * `Object` - a plain Object, values are mapped then flattened into result by `Object.assign`
 *   * `Reducer` - a function to be used in a reducing operation. Items of a flatMapped reducing operation are mapped then flattened into the aggregate
 *
 * On arrays, map the flatMapper function with concurrent asynchronous execution, then flatten the result one depth.
 *
 * ```javascript [playground]
 * const duplicate = number => [number, number]
 *
 * console.log(
 *   flatMap(duplicate)([1, 2, 3, 4, 5]),
 * ) // [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]
 *
 * const asyncDuplicate = async number => [number, number]
 *
 * flatMap(asyncDuplicate)( // concurrent execution
 *   [1, 2, 3, 4, 5]).then(console.log) // [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]
 * ```
 *
 * Collections returned by the flatMapper are flattened into the result by type-specific iteration and concatenation, while async iterables are muxed. Muxing, or asynchronously "mixing", is the process of combining multiple asynchronous sources into one source, with order determined by the asynchronous resolution of the individual items. This behavior is useful for working with asynchronous streams, e.g. of DOM events or requests.
 *
 * ```javascript [playground]
 * const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
 *
 * const repeat3 = function* (message) {
 *   yield message; yield message; yield message
 * }
 *
 * console.log( // sync is concatenated
 *   flatMap(repeat3)(['foo', 'bar', 'baz']),
 * ) // ['foo', 'foo', 'foo', 'bar', 'bar', 'bar', 'baz', 'baz', 'baz']
 *
 * const asyncRepeat3 = async function* (message) {
 *   yield message
 *   await sleep(100)
 *   yield message
 *   await sleep(1000)
 *   yield message
 * }
 *
 * flatMap(asyncRepeat3)( // async is muxed
 *   ['foo', 'bar', 'baz']).then(console.log)
 * // ['foo', 'bar', 'baz', 'foo', 'bar', 'baz', 'foo', 'bar', 'baz']
 * ```
 *
 * Upon flatMapper execution, flatten any collection return into the result.
 *
 *   * Iterable - items are concatenated into the result
 *   * Iterator/Generator - items are concatenated into the result. Source is consumed.
 *   * Object that implements `.reduce` - this function is called directly for flattening
 *   * Object that implements `.chain` or `.flatMap` - either of these is called directly to flatten
 *   * any other Object - values are flattened
 *   * AsyncIterable - items are muxed by asynchronous resolution
 *   * AsyncIterator/AsyncGenerator - items are muxed by asynchronous resolution. Source is consumed.
 *
 * All other types are left in the result as they are.
 *
 * ```javascript [playground]
 * const identity = value => value
 *
 * flatMap(identity)([
 *   [1, 1],
 *   new Set([2, 2]),
 *   (function* () { yield 3; yield 3 })(),
 *   (async function* () { yield 4; yield 4 })(),
 *   { a: 5, b: 5 },
 *   6,
 *   Promise.resolve(7),
 *   new Uint8Array([8]),
 * ]).then(console.log)
 * // [1, 1, 2, 3, 3, 5, 5, 6, 7, 8, 4, 4]
 * ```
 *
 * Purer functional programming is possible with flatMap operation on monads. A monad could be any object that implements `.chain` or `.flatMap`. When a flatMapping operation encounters a monad, it calls the monad's `.chain` method directly to flatten.
 *
 * ```javascript [playground]
 * const Maybe = value => ({
 *   chain(flatMapper) {
 *     return value == null ? value : flatMapper(value)
 *   },
 * })
 *
 * flatMap(console.log)(Maybe(null))
 *
 * flatMap(console.log)(Maybe('hello world')) // hello world
 * ```
 *
 * In addition to monads, `flatMap` is a powerful option when working with transducers as well. A flatMapping transducer is like a mapping transducer except all items of the reducing operation are additionally flattened into the result.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * const powers = number => [number, number ** 2, number ** 3]
 *
 * const oddPowers = pipe([
 *   filter(isOdd),
 *   flatMap(powers),
 * ])
 *
 * console.log(
 *   transform(oddPowers, [])([1, 2, 3, 4, 5]),
 * ) // [1, 1, 1, 3, 9, 27, 5, 25, 125]
 *
 * const asyncPowers = async number => [number, number ** 2, number ** 3]
 *
 * const asyncOddPowers = pipe([
 *   filter(isOdd),
 *   flatMap(asyncPowers),
 * ])
 *
 * transform(asyncOddPowers, [])([1, 2, 3, 4, 5]).then(console.log)
 * // [1, 1, 1, 3, 9, 27, 5, 25, 125]
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

module.exports = flatMap
