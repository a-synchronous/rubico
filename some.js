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
 * type Foldable = Array|Iterable|AsyncIterable|{ reduce: function }|Object
 *
 * some(collection Foldable, predicate function) -> Promise|boolean
 *
 * some(predicate function)(collection Foldable) -> Promise|boolean
 * ```
 *
 * @description
 * Test a predicate concurrently across all items of a collection, returning true if any executions return truthy.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * console.log(
 *   some([1, 2, 3, 4, 5], isOdd),
 * ) // true
 * ```
 *
 * The collection can be any iterable, async iterable, or object values iterable collection. Below is an example of `some` accepting an async generator as the collection.
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
 * @execution concurrent
 *
 * @muxing
 *
 * @related or
 */

const some = function (...args) {
  const predicate = args.pop()
  if (args.length == 0) {
    return curry2(_some, __, predicate)
  }

  const collection = args[0]
  if (isPromise(collection)) {
    return collection.then(curry2(_some, __, predicate))
  }

  return _some(collection, predicate)
}

module.exports = some
