const funcConcat = require('./funcConcat')
const __ = require('./placeholder')
const curry2 = require('./curry2')
const arrayMap = require('./arrayMap')
const isPromise = require('./isPromise')
const arrayFlatten = require('./arrayFlatten')
const arrayJoin = require('./arrayJoin')

/**
 * @name arrayFlattenToString
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Stream<T> = { read: ()=>T, write: T=>() }
 * Monad<T> = Array<T>|String<T>|Set<T>
 *   |TypedArray<T>|Stream<T>|Iterator<Promise|T>
 *   |{ chain: T=>Monad<T> }|{ flatMap: T=>Monad<T> }|Object<T>
 * Reducer<T> = (any, T)=>Promise|any
 * Foldable<T> = Iterable<T>|AsyncIterable<T>|{ reduce: Reducer<T> }|Object<T>
 *
 * arrayFlattenToString<T>(
 *   array Array<Monad<T>|Foldable<T>|T>,
 * ) -> String<T>
 * ```
 */
const arrayFlattenToString = funcConcat(
  arrayFlatten,
  curry2(arrayJoin, __, ''))

/**
 * @name stringFlatMap
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Stream<T> = { read: ()=>T, write: T=>() }
 * Monad<T> = Array<T>|String<T>|Set<T>
 *   |TypedArray<T>|Stream<T>|Iterator<Promise|T>
 *   |{ chain: T=>Monad<T> }|{ flatMap: T=>Monad<T> }|Object<T>
 * Reducer<T> = (any, T)=>Promise|any
 * Foldable<T> = Iterable<T>|AsyncIterable<T>|{ reduce: Reducer<T> }|Object<T>
 *
 * stringFlatMap<T>(
 *   string String<T>,
 *   flatMapper T=>Promise|Monad<T>|Foldable<T>|T,
 * ) -> Promise|String<T>
 * ```
 *
 * @related arrayFlatMap
 */
const stringFlatMap = function (string, flatMapper) {
  const monadArray = arrayMap(string, flatMapper)
  return isPromise(monadArray)
    ? monadArray.then(arrayFlattenToString)
    : arrayFlattenToString(monadArray)
}

module.exports = stringFlatMap
