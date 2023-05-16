const isArray = require('./_internal/isArray')
const objectValues = require('./_internal/objectValues')
const arrayAny = require('./_internal/arrayAny')
const iteratorAny = require('./_internal/iteratorAny')
const asyncIteratorAny = require('./_internal/asyncIteratorAny')
const reducerAny = require('./_internal/reducerAny')
const symbolIterator = require('./_internal/symbolIterator')
const symbolAsyncIterator = require('./_internal/symbolAsyncIterator')

/**
 * @name some
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Foldable = Iterable|AsyncIterable|Object
 *
 * some(predicate function)(collection Foldable) -> result Promise|boolean
 * ```
 *
 * @description
 * Test a predicate concurrently across all items of a collection, returning true if any executions return truthy.
 *
 * ```javascript [playground]
 * const isOdd = number => number % 2 == 1
 *
 * console.log(
 *   some(isOdd)([1, 2, 3, 4, 5]),
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
 * some(pipe([
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
const some = predicate => function anyTruthy(value) {
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
    return value.reduce(reducerAny(predicate), false)
  }
  if (value.constructor == Object) {
    return arrayAny(objectValues(value), predicate)
  }
  return predicate(value)
}

module.exports = some
