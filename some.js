const isPromise = require('./_internal/isPromise')
const __ = require('./_internal/placeholder')
const curry2 = require('./_internal/curry2')
const isArray = require('./_internal/isArray')
const objectValues = require('./_internal/objectValues')
const arraySome = require('./_internal/arraySome')
const iteratorSome = require('./_internal/iteratorSome')
const asyncIteratorSome = require('./_internal/asyncIteratorSome')
const reducerSome = require('./_internal/reducerSome')
const symbolIterator = require('./_internal/symbolIterator')
const symbolAsyncIterator = require('./_internal/symbolAsyncIterator')

// _some(collection Array|Iterable|AsyncIterable|{ reduce: function }|Object, predicate function) -> Promise|boolean
const _some = function (collection, predicate) {
  if (isArray(collection)) {
    return arraySome(collection, predicate)
  }
  if (collection == null) {
    return predicate(collection)
  }
  if (typeof collection[symbolIterator] == 'function') {
    return iteratorSome(collection[symbolIterator](), predicate)
  }
  if (typeof collection[symbolAsyncIterator] == 'function') {
    return asyncIteratorSome(
      collection[symbolAsyncIterator](), predicate, new Set()
    )
  }
  if (typeof collection.reduce == 'function') {
    return collection.reduce(reducerSome(predicate), false)
  }
  if (collection.constructor == Object) {
    return arraySome(objectValues(collection), predicate)
  }
  return predicate(collection)
}

/**
 * @name some
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Foldable = Array|Set|Map|Generator|AsyncGenerator|{ reduce: function }|Object
 * type UnarySyncOrAsyncPredicate = any=>Promise|boolean
 *
 * predicate UnarySyncOrAsyncPredicate
 *
 * some(foldable Foldable, predicate) -> Promise|boolean
 * some(predicate)(foldable Foldable) -> Promise|boolean
 * ```
 *
 * @description
 * Test a predicate concurrently across all elements of a foldable, returning true if any executions return true.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * console.log(
 *   some([1, 2, 3, 4, 5], isOdd),
 * ) // true
 * ```
 *
 * The following data types are considered to be foldables:
 *  * `array`
 *  * `set`
 *  * `map`
 *  * `generator`
 *  * `async generator`
 *  * `object with .reduce method`
 *  * `object`
 *
 * `some` works for async generators.
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
 * const promise = some(todoIDsGenerator(), async id => {
 *   const todo = await fetchTodo(id)
 *   return todo.title.startsWith('fugiat')
 * })
 *
 * promise.then(console.log) // true
 * ```
 *
 * `some` supports a lazy API for composability.
 *
 * ```javascript [playground]
 * pipe([1, 2, 3], [
 *   some(number => number < 5),
 *   console.log, // true
 * ])
 * ```
 *
 * Any promises passed in argument position are resolved for their values before further execution. This only applies to the eager version of the API.
 *
 * ```javascript [playground]
 * some(Promise.resolve([1, 2, 3, 4, 5]), n => n > 6).then(console.log) // false
 * ```
 *
 * See also:
 *  * [map](/docs/map)
 *  * [every](/docs/every)
 *  * [and](/docs/and)
 *
 * @execution concurrent
 *
 * @muxing
 *
 * @related or
 */
const some = function (arg0, arg1) {
  if (typeof arg0 == 'function') {
    return curry2(_some, __, arg0)
  }
  return isPromise(arg0)
    ? arg0.then(curry2(_some, __, arg1))
    : _some(arg0, arg1)
}

module.exports = some
