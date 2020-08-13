const PossiblePromise = require('../monad/PossiblePromise')
const Instance = require('../monad/Instance')
const Mux = require('../monad/Mux')
const { switchCase, reduce, flatMap, any } = require('..')
const is = require('./is')

const { isArray, isSet, isFunction, isPromise } = Instance

const symbolIterator = Symbol.iterator

const symbolAsyncIterator = Symbol.asyncIterator

const possiblePromiseThen = PossiblePromise.then

const {
  isAsyncSequence,
  concat: muxConcat,
  flatten: muxFlatten,
} = Mux

/**
 * @name arrayPush
 *
 * @synopsis
 * arrayPush(arr Array, value any) -> undefined
 */
const arrayPush = (arr, value) => {
  arr[arr.length] = value
}

/**
 * @name setAdd
 *
 * @synopsis
 * setAdd(set Set, value any) -> undefined
 */
const setAdd = (set, value) => {
  set.add(value)
}

/**
 * @name asyncExistsWith
 *
 * @synopsis
 * <T any>asyncExistsWith(
 *   predicate (T, T)=>Promise<boolean>,
 *   value T,
 *   iter Iterable<T>,
 * ) -> doesValueExistInResultByPredicate Promise<boolean>
 */
const asyncExistsWith = async (predicate, member, iter) => {
  for (const item of iter) {
    if (await predicate(item, member)) return true
  }
  return false
}

/**
 * @name existsWith
 *
 * @synopsis
 * <T any>existsWith(
 *   predicate (T, T)=>boolean,
 *   member T,
 *   iter Iterable<T>,
 * ) -> doesValueExistInResultByPredicate boolean
 */
const existsWith = (predicate, member, iter) => {
  const iterNext = iter.next.bind(iter)
  while (true) {
    const { value, done } = iterNext()
    if (done) return false
    const exists = predicate(member, value)
    if (isPromise(exists)) return exists.then(res => (
      res ? true : asyncExistsWith(predicate, member, iter)))
    if (exists) return true
  }
}

/**
 * @name asyncGenericUnionWithGeneric
 *
 * @synopsis
 * <T any>asyncGenericUnionWithGeneric(
 *   predicate (T, T)=>boolean,
 *   iter Iterator<T>,
 *   result Iterable<T>,
 *   setter (result Iterable<T>, T)=>(),
 * ) -> result Promise|Iterable<T>
 */
const asyncGenericUnionWithGeneric = async (predicate, iter, result, setter) => {
  const iterNext = iter.next.bind(iter)
  while (true) {
    const { value, done } = await iterNext()
    if (done) return result
    if (await existsWith(predicate, value, result[symbolIterator]())) continue
    setter(result, value)
  }
}

/**
 * @name genericUnionWithGeneric
 *
 * @synopsis
 * <T any>genericUnionWithGeneric(
 *   predicate (T, T)=>boolean,
 *   iter Iterator<T>,
 *   result Iterable<T>,
 *   setter (result Iterable<T>, T)=>(),
 * ) -> result Promise|Iterable<T>
 *
 * @NOTE no asyncIterators in this version
 */
const genericUnionWithGeneric = (predicate, iter, result, setter) => {
  const iterNext = iter.next.bind(iter)
  const next = iterNext()

  /* if (isPromise(next)) return next.then(({ value, done }) => {
    if (done) return result
    setter(result, value)
    return asyncGenericUnionWithGeneric(predicate, iter, result, setter)
  }) */

  const { value, done } = next
  if (done) return result
  setter(result, value)
  while (true) {
    const { value, done } = iterNext()
    if (done) return result
    const exists = existsWith(predicate, value, result[symbolIterator]())
    if (isPromise(exists)) return exists.then(res => {
      if (!res) setter(result, value)
      return asyncGenericUnionWithGeneric(predicate, iter, result, setter)
    })
    if (exists) continue
    setter(result, value)
  }
}

/* const iteratorUnionWithArray = (predicate, iter) => {
  const result = []
  for (const value of iter) {
    const exists = existsWith(predicate, value, result)
    if (isPromise(exists)) {
      const iterCopy = [...iter][symbolIterator]() // TODO: investigate this workaround. iter is empty inside the .then block
                                                   // there may be a bug with for const of
      return exists.then(res => {
        if (!res) arrayPush(result, value)
        return asyncIteratorUnionWithArray(predicate, iterCopy, result)
      })
    }
    if (exists) continue
    arrayPush(result, value)
  }
  return result
} */

/**
 * @name iteratorUnionWithIterator
 *
 * @synopsis
 * <T any>iteratorUnionWithIterator(
 *   predicate (T, T)=>boolean
 *   iter Iterator<T>
 * ) -> Iterator<T>
const iteratorUnionWithIterator = function*(predicate, iter) {
  const yielded = [], iterNext = iter.next.bind(iter)
  for (const value of iter) {
    if (existsWith(predicate, value, yielded[symbolIterator]())) continue
    arrayPush(yielded, value)
    yield value
  }
} */

/* const iteratorUnionWithIterator = function*(predicate, iter) {
  const yielded = [], iterNext = iter.next.bind(iter)
  while (true) {
    const { value, done } = iterNext()
    if (done) return
    if (existsWith(predicate, value, yielded[symbolIterator]())) continue
    arrayPush(yielded, value)
    yield value
  }
} */

/**
 * @name asyncIteratorUnionWithAsyncIterator
 *
 * @synopsis
 * <T any>asyncIteratorUnionWithAsyncIterator(
 *   predicate (T, T)=>boolean
 *   iter AsyncIterator<T>
 * ) -> AsyncIterator<T>
const asyncIteratorUnionWithAsyncIterator = async function*(predicate, iter) {
  const yielded = []
  for await (const value of iter) {
    if (await existsWith(predicate, value, yielded[symbolIterator]())) continue
    arrayPush(yielded, value)
    yield value
  }
} */

/**
 * @name unionWith
 *
 * @synopsis
 * Iterable|GeneratorFunction -> SyncSequence
 * AsyncIterable|AsyncGeneratorFunction -> AsyncSequence
 * SyncSequence|AsyncSequence -> Sequence
 *
 * <T any>unionWith(
 *   predicate (T, T)=>Promise<boolean>|boolean,
 * )(values Array<Sequence<T>|T>|T) -> result Promise<Array<T>>|Array<T>
 *
 * <T any>unionWith(
 *   predicate (T, T)=>Promise<boolean>|boolean,
 * )(values Set<Sequence<T>|T>|T) -> result Promise<Set<T>>|Set<T>
 *
 * <T any>unionWith(
 *   predicate (T, T)=>boolean,
 * )(values SyncSequence<SyncSequence<T>|T>|T) -> result Iterator<T>
 *
 * <T any>unionWith(
 *   predicate (T, T)=>Promise<boolean>|boolean,
 * )(values Sequence<Sequence<T>|T>|T) -> result AsyncIterator<T>
 *
 * @catchphrase
 * Unite disparate collections with a predicate
 *
 * @description
 * `unionWith` accepts a binary function `predicate` and any Sequence `values` and returns a flattened collection with all sub items `T` of the Sequence `values` uniq'd by `predicate`. The binary function `predicate` takes two arguments that represent two given sub items `T` and returns an expression that evaluates to true if those two given sub items are the same. A Sequence of values can be an Iterable, GeneratorFunction, AsyncIterable, or AsyncGeneratorFunction. The possible return values of `unionWith` are:
 *  * Array - for Array `values`
 *  * Set - for Set `values`
 *  * Iterator - for Iterables beyond Array and Set, such as GeneratorFunctions
 *  * AsyncIterator - for AsyncIterables and AsyncGeneratorFunctions
 */
const unionWith = predicate => values => {
  if (values == null) return []
  if (isArray(values)) return genericUnionWithGeneric(
    predicate, muxFlatten(values)[symbolIterator](), [], arrayPush)
  if (isSet(values)) return genericUnionWithGeneric(
    predicate, muxFlatten(values)[symbolIterator](), new Set(), setAdd)
  return [values]
}

/* unionWith = predicate => values => { // TODO: performance is a problem for generators vs Arrays. Would be nice to
                                        //       figure out a way to get good Array performance even with support for full muxes
  if (isArray(values)) return genericUnionWithGeneric(
    predicate, muxConcat(values), [], arrayPush)
  if (isSet(values)) return genericUnionWithGeneric(
    predicate, muxConcat(values), new Set(), setAdd)
  const iter = muxConcat(values)
  return (iter[symbolIterator]
    ? iteratorUnionWithIterator(predicate, iter)
    : asyncIteratorUnionWithAsyncIterator(predicate, iter))
} */

module.exports = unionWith
