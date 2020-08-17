/* rubico v1.5.0
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2020 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */

'use strict'

const Instance = require('./Instance')

const { isArray, isObject, isSet, isIterable, isAsyncIterable, isFunction } = Instance

const objectProto = Object.prototype

const nativeObjectToString = objectProto.toString

const objectToString = value => nativeObjectToString.call(value)

const symbolIterator = Symbol.iterator

const symbolAsyncIterator = Symbol.asyncIterator

const generatorFunctionTag = '[object GeneratorFunction]'

const asyncGeneratorFunctionTag = '[object AsyncGeneratorFunction]'

const promiseRace = Promise.race.bind(Promise)

/**
 * @synopsis
 * isGeneratorFunction(value !null) -> boolean
 */
const isGeneratorFunction = value => {
  const tag = objectToString(value)
  return tag == generatorFunctionTag || tag == asyncGeneratorFunctionTag
}

/**
 * @synopsis
 * isSequence(value any) -> boolean
 */
const isSequence = value => value != null
  && (typeof value[symbolIterator] == 'function'
    || typeof value[symbolAsyncIterator] == 'function'
    || isGeneratorFunction(value))

/**
 * @synopsis
 * isAsyncSequence(value any) -> boolean
 */
const isAsyncSequence = value => value != null
  && (typeof value[symbolAsyncIterator] == 'function'
    || objectToString(value) == asyncGeneratorFunctionTag)

/**
 * @name Mux
 *
 * @synopsis
 * Iterable|GeneratorFunction -> SyncSequence
 * AsyncIterable|AsyncGeneratorFunction -> AsyncSequence
 * SyncSequence|AsyncSequence -> Sequence
 *
 * <T any>new Mux(Sequence<Sequence<T>|T>|T) -> Mux
 *
 * @catchphrase
 * Multiplexing for Sequences of Sequences
 *
 * @WARNING
 * Iterators have defined a self-referencing Symbol.iterator, which means they'll check out as Iterables but will deplete prematurely. Supplying a direct Iterator as the top level sequence in any capacity to Mux will cause undesirable behavior.
 */
const Mux = function(x) {
  if (!isSequence(x)) {
    throw new TypeError(`${x} is not a Sequence`)
  }
  this.value = x
}

/**
 * @name Mux.isSequence
 *
 * @synopsis
 * Mux.isSequence(x any) -> boolean
 *
 * @catchphrase
 * Tell if Sequence
 *
 * @description
 * Mux.isSequence takes anything and returns a Boolean value. Mux.isSequence returns true if the value is an Iterable, GeneratorFunction, AsyncIterable, or AsyncGeneratorFunction.
 *
 * @example
 * console.log(
 *   Mux.isSequence([[1], [2], [3]]),
 * ) // true
 */
Mux.isSequence = isSequence

/**
 * @name iteratorOf
 *
 * @synopsis
 * <T any>iteratorOf(x T) -> Iterator<T>
 */
const iteratorOf = x => [x][symbolIterator]()

/**
 * @name getSyncIterator
 *
 * @synopsis
 * Iterable|GeneratorFunction -> SyncSequence
 *
 * <T any>getSyncIterator(x SyncSequence<T>|T) -> Iterator<T>
 */
const getSyncIterator = x => (x[symbolIterator] ? x[symbolIterator]()
  : isFunction(x) ? x() : iteratorOf(x))

/**
 * @name getIterator
 *
 * @synopsis
 * Iterable|GeneratorFunction
 *   |AsyncIterable|AsyncGeneratorFunction -> Sequence
 *
 * <T any>getIterator(x Sequence<T>|T) -> Iterator<T>|AsyncIterator<T>
 */
const getIterator = x => {
  if (x[symbolIterator]) return x[symbolIterator]()
  if (x[symbolAsyncIterator]) return x[symbolAsyncIterator]()
  if (isFunction(x)) return x()
  return iteratorOf(x)
}

/**
 * @name sequenceIsAsync
 *
 * @synopsis
 * Iterable|GeneratorFunction
 *   |AsyncIterable|AsyncGeneratorFunction -> Sequence
 *
 * sequenceIsAsync(x Sequence) -> boolean
 */
const sequenceIsAsync = x => (
  x[symbolAsyncIterator] || objectToString(x) == asyncGeneratorFunctionTag)

/**
 * @name muxIsSync
 *
 * @synopsis
 * Iterable|GeneratorFunction
 *   |AsyncIterable|AsyncGeneratorFunction -> Sequence
 *
 * <T any>muxIsSync(x Sequence<Sequence<T>|T>) -> boolean
 */
const muxIsSync = x => {
  if (sequenceIsAsync(x)) return false
  for (const xi of getSyncIterator(x)) {
    if (sequenceIsAsync(xi)) return false
  }
  return true
}

/**
 * @name muxZipSync
 *
 * @synopsis
 * Iterable|GeneratorFunction -> SyncSequence
 *
 * <T any>muxZipSync(
 *   x SyncSequence<SyncSequence<T>|T>|T,
 * ) -> Iterator<Array<T|undefined>>
 */
const muxZipSync = function*(x) {
  const iterators = []
  for (const xi of getSyncIterator(x)) {
    iterators.push(isSequence(xi) ? getSyncIterator(xi) : iteratorOf(xi))
  }
  const iteratorsLength = iterators.length
  while (true) {
    const zippedRow = []
    let numDone = 0
    for (const iter of iterators) {
      const { value, done } = iter.next()
      zippedRow.push(value)
      if (done) numDone += 1
    }
    if (numDone == iteratorsLength) return
    yield zippedRow
  }
}

const promiseAll = Promise.all.bind(Promise)

/**
 * @name muxZipAsync
 *
 * @synopsis
 * Iterable|GeneratorFunction
 *   |AsyncIterable|AsyncGeneratorFunction -> Sequence
 *
 * <T any>muxZipAsync(
 *   x Sequence<Sequence<T>|T>|T,
 * ) -> AsyncIterator<Array<T|undefined>>
 */
const muxZipAsync = async function*(x) {
  const iterators = []
  for await (const xi of getIterator(x)) {
    iterators.push(isSequence(xi) ? getIterator(xi) : iteratorOf(xi))
  }
  const iteratorsLength = iterators.length
  const iteratorsMap = iterators.map.bind(iterators)
  while (true) {
    let numDone = 0
    const zippedRow = await promiseAll(iteratorsMap(async iter => {
      const { value, done } = await iter.next()
      if (done) numDone += 1
      return value
    }))
    if (numDone == iteratorsLength) return
    yield zippedRow
  }
}

/**
 * @name
 * Mux.zip
 *
 * @synopsis
 * Iterable|GeneratorFunction -> SyncSequence
 * AsyncIterable|AsyncGeneratorFunction -> AsyncSequence
 * SyncSequence|AsyncSequence -> Sequence
 *
 * <T any>Mux.zip(
 *   x SyncSequence<SyncSequence<T>|T>|T,
 * ) -> Iterator<Array<T|undefined>>
 *
 * <T any>Mux.zip(
 *   x Sequence<Sequence<T>|T>|T,
 * ) -> AsyncIterator<Array<T|undefined>>
 *
 * @catchphrase
 * Create rows from disparate Sequences
 *
 * @description
 * Mux.zip takes a Sequence of items or Sequences of items and outputs either an Iterator or an AsyncIterator that yields an Array of items of each supplied Sequence for a given iteration. If any Sequence supplied to Mux.zip is AsyncIterable or an AsyncGeneratorFunction, Mux.zip outputs an AsyncIterator. The Iterator or AsyncIterator will iterate as long as the longest iterator of the supplied Sequences; shorter iterators will yield undefined until the longest iterator is consumed.
 *
 * @example
 * const iterator = Mux.zip([[1, 2, 3], ['a', 'b', 'c']])
 *
 * for (const item of iterator) {
 *   console.log(item) // [1, 'a']
 *                     // [2, 'b']
 *                     // [3, 'c']
 * }
 */
Mux.zip = x => muxIsSync(x) ? muxZipSync(x) : muxZipAsync(x)

/**
 * @name muxConcatSync
 *
 * @synopsis
 * Iterable|GeneratorFunction -> SyncSequence
 *
 * <T any>muxConcatSync(
 *   x SyncSequence<SyncSequence<T>|T>|T,
 * ) -> Iterator<T>
 */
const muxConcatSync = function*(x) {
  for (const xi of getSyncIterator(x)) {
    isSequence(xi) ? yield* getSyncIterator(xi) : yield xi
  }
}

/**
 * @name muxConcatAsync
 *
 * @synopsis
 * Iterable|GeneratorFunction -> SyncSequence
 * AsyncIterable|AsyncGeneratorFunction -> AsyncSequence
 * SyncSequence|AsyncSequence -> Sequence
 *
 * <T any>muxConcatAsync(
 *   x Sequence<Sequence<T>|T>|T,
 * ) -> AsyncIterator<T>
 */
const muxConcatAsync = async function*(x) {
  for await (const xi of getIterator(x)) {
    isSequence(xi) ? yield* getIterator(xi) : yield xi
  }
}

/**
 * @name Mux.concat
 *
 * @synopsis
 * Iterable|GeneratorFunction -> SyncSequence
 * AsyncIterable|AsyncGeneratorFunction -> AsyncSequence
 * SyncSequence|AsyncSequence -> Sequence
 *
 * <T any>Mux.concat(
 *   x SyncSequence<SyncSequence<T>|T>|T,
 * ) -> Iterator<T>
 *
 * <T any>Mux.concat(
 *   x Sequence<Sequence<T>|T>|T,
 * ) -> AsyncIterator<T>
 *
 * @catchphrase
 * Concatenate Sequences into one
 *
 * @description
 * Mux.concat takes a Sequence of items or Sequences of items and outputs either an Iterator or an AsyncIterator that yields each item individually. The first of these items is the first item of the first Sequence, the next is the second item of the first Sequence, and so on until all Sequences have been iterated in order. Non-Sequence Items in the top-level Sequence are yielded as they are.
 *
 * @example
 * const iter = Mux.concat([
 *   [1, 2, 3],
 *   [4, 5, 6],
 *   [7, 8, 9],
 * ])
 *
 * for (const number of iter) {
 *   console.log(number) // 1 2 3 4 5 6 7 8 9
 * }
 */
Mux.concat = x => muxIsSync(x) ? muxConcatSync(x) : muxConcatAsync(x)

/**
 * @name muxSwitchSync
 *
 * @synopsis
 * <T any>muxSwitchSync(
 *   x SyncSequence<SyncSequence<T>|T>|T,
 * ) -> Iterator<T>
 */
const muxSwitchSync = function*(x) {
  const iterators = []
  for (const xi of getSyncIterator(x)) {
    iterators.push(isSequence(xi) ? getSyncIterator(xi) : iteratorOf(xi))
  }
  const iteratorsLength = iterators.length
  while (true) {
    let numDone = 0
    for (const iter of iterators) {
      const { value, done } = iter.next()
      if (done) { numDone += 1; continue }
      yield value
    }
    if (numDone == iteratorsLength) return
  }
}

/**
 * @name muxSwitchAsync
 *
 * @synopsis
 * Iterable|GeneratorFunction -> SyncSequence
 * AsyncIterable|AsyncGeneratorFunction -> AsyncSequence
 * SyncSequence|AsyncSequence -> Sequence
 *
 * <T any>muxSwitchAsync(
 *   x Sequence<Sequence<T>|T>|T,
 * ) -> AsyncIterator<T>
 */
const muxSwitchAsync = async function*(x) {
  const iterators = []
  for await (const xi of getIterator(x)) {
    iterators.push(isSequence(xi) ? getIterator(xi) : iteratorOf(xi))
  }
  const iteratorsLength = iterators.length
  while (true) {
    let numDone = 0
    for (const iter of iterators) {
      const { value, done } = await iter.next()
      if (done) { numDone += 1; continue }
      yield value
    }
    if (numDone == iteratorsLength) return
  }
}

/**
 * @name Mux.switch
 *
 * @synopsis
 * Iterable|GeneratorFunction -> SyncSequence
 * AsyncIterable|AsyncGeneratorFunction -> AsyncSequence
 * SyncSequence|AsyncSequence -> Sequence
 *
 * <T any>Mux.switch(
 *   x SyncSequence<SyncSequence<T>|T>|T,
 * ) -> Iterator<T>
 *
 * <T any>Mux.switch(
 *   x Sequence<Sequence<T>|T>|T,
 * ) -> AsyncIterator<T>
 *
 * @catchphrase
 * Interleave Sequences into one
 *
 * @description
 * Mux.switch takes a Sequence of items or Sequences of items and outputs either an Iterator or an AsyncIterator that yields each item individually. The first of these items is the first item of the first Sequence, the next is the first item of the second Sequence, and so on until all Sequences have yielded their first item. Then, the first Sequence yields its second item, the second Sequence yields its second item, and so on until all Sequences have finished iterating. Non-Sequence Items in the top-level Sequence are yielded as they are. When a shorter Sequence finishes iterating, the remaining Sequences will switch yielding amongst themselves.
 *
 * @example
 * const iter = Mux.switch([
 *   [1, 1, 1],
 *   [2, 2, 2],
 *   [3, 3, 3],
 * ])
 * for (const number of iter) {
 *   console.log(number) // 1 2 3 1 2 3 1 2 3
 * }
 */
Mux.switch = x => muxIsSync(x) ? muxSwitchSync(x) : muxSwitchAsync(x)

/**
 * @name muxRaceAsync
 *
 * @synopsis
 * <T any>muxRaceAsync(x Sequence<Sequence<T>|T>|T) -> AsyncIterator<T>
 */
const muxRaceAsync = async function*(x) {
  const promises = new Set()
  for await (const xi of getIterator(x)) {
    if (isAsyncSequence(xi)) {
      const iter = getIterator(xi)
      const p = iter.next().then(res => [p, iter, res])
      promises.add(p)
    } else {
      yield* getIterator(xi)
    }
  }
  while (promises.size > 0) {
    const [prevP, iter, { value, done }] = await promiseRace(promises)
    promises.delete(prevP)
    if (done) continue
    yield value
    const p = iter.next().then(res => [p, iter, res])
    promises.add(p)
  }
}

/**
 * @name Mux.race
 *
 * @synopsis
 * Iterable|GeneratorFunction -> SyncSequence
 * AsyncIterable|AsyncGeneratorFunction -> AsyncSequence
 * SyncSequence|AsyncSequence -> Sequence
 *
 * <T any>Mux.race(
 *   x SyncSequence<SyncSequence<T>|T>T,
 * ) -> Iterator<T>
 *
 * <T any>Mux.race(
 *   x Sequence<Sequence<T>|T>T,
 * ) -> AsyncIterator<T>
 *
 * @catchphrase
 * Asynchronously Race Sequences into one
 *
 * @description
 * Mux.race takes a Sequence of items or Sequences of items and outputs either an Iterator or an AsyncIterator that yields each item individually. The first of these items are the synchronous items of the top level Sequence, followed by the asynchronous items of any asynchronous sub Sequences. If any sub Sequences are asynchronous, the order of these asynchronous items in the final returned AsyncIterator is determined by the serial asynchronous resolution of the individual asynchronous sub Sequences. If all Sequences are synchronous, Mux.race behaves just as Mux.concat.
 *
 * @example
 * const f = async function*() { await delay(5); yield 10; yield 20 }
 * const g = async function*() { yield 1; yield 2; yield 3; await delay(10); yield 30 }
 *
 * const iter = Mux.race([f, g])
 *
 * for await (const number of iter) {
 *   console.log(number) // 1 2 3 10 20 30
 * }
 */
Mux.race = x => muxIsSync(x) ? muxConcatSync(x) : muxRaceAsync(x)

/**
 * @name arrayPushArray
 *
 * @synopsis
 * arrayPushArray(x Array, array Array) -> undefined
 */
const arrayPushArray = (x, array) => {
  const offset = x.length, length = array.length
  let i = -1
  while (++i < length) {
    x[offset + i] = array[i]
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

const muxConcat = Mux.concat

/**
 * @name Mux.flatten
 *
 * @synopsis
 * <T any>Mux.flatten(x Array<Iterable<T>|T>) -> Array<T>
 *
 * <T any>Mux.flatten(x Set<Iterable<T>|T>) -> Set<T>
 *
 * <T !Array|!Set>Mux.flatten(x T) -> Mux.concat(x)
 *
 * @name Mux.flatten
 *
 * @synopsis
 * Iterable|GeneratorFunction -> SyncSequence
 * AsyncIterable|AsyncGeneratorFunction -> AsyncSequence
 * SyncSequence|AsyncSequence -> Sequence
 *
 * <T any>Mux.race(
 *   x SyncSequence<SyncSequence<T>|T>,
 * ) -> Iterator<T>
 *
 * <T any>Mux.race(
 *   x Sequence<Sequence<T>|T>,
 * ) -> AsyncIterator<T>
 *
 * @catchphrase
 * Asynchronously Race Sequences into one
 *
 * @description
 * Mux.flatten behaves just as Mux.concat except for cases when passed an Array or Set. When passed an Array, Mux.flatten outputs another Array with all elements of the input Array concatenated. When passed a Set, Mux.flatten outputs another Set in the same regard.
 *
 * @example
 * console.log(
 *   Mux.flatten([[1], 2, [3], 4, [5]]),
 * ) // [1, 2, 3, 4, 5]
 */
Mux.flatten = x => {
  if (isArray(x)) return arrayFlatten(x)
  if (isSet(x)) return genericFlatten('add', new Set(), x)
  return muxConcat(x)
}

// Mux.flatten = x => genericFlatten('push', [], x)

/* Mux.flatten = x => (
  isArray(x) ? genericFlatten('push', [], x) : genericFlatten('add', new Set(), x)) */

module.exports = Mux
