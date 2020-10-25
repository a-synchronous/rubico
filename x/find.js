const isArray = require('../_internal/isArray')
const symbolIterator = require('../_internal/symbolIterator')
const symbolAsyncIterator = require('../_internal/symbolAsyncIterator')
const objectValues = require('../_internal/objectValues')
const arrayFind = require('../_internal/arrayFind')
const iteratorFind = require('../_internal/iteratorFind')
const asyncIteratorFind = require('../_internal/asyncIteratorFind')

/**
 * @name find
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Foldable<T> = Iterable<T>|AsyncIterable<T>|{ reduce: (any, T)=>any }|Object<T>
 *
 * var T any,
 *   predicate T=>Promise|boolean,
 *   foldable Foldable<T>,
 *   result Promise|T|undefined
 *
 * find(predicate)(foldable) -> result
 * ```
 *
 * @description
 * Get the first item in a foldable collection that matches a predicate.
 *
 * ```javascript [playground]
 * import find from 'https://unpkg.com/rubico/dist/x/find.es.js'
 *
 * const users = [
 *   { name: 'John', age: 16 },
 *   { name: 'Jill', age: 32 },
 *   { name: 'George', age: 51 },
 * ]
 *
 * console.log(
 *   find(user => user.age > 50)(users),
 * ) // { name: 'George', age: 51 }
 * ```
 */
const find = predicate => function finding(value) {
  if (isArray(value)) {
    return arrayFind(value, predicate)
  }
  if (value == null) {
    return undefined
  }
  if (typeof value[symbolIterator] == 'function') {
    return iteratorFind(value[symbolIterator](), predicate)
  }
  if (typeof value[symbolAsyncIterator] == 'function') {
    return asyncIteratorFind(value[symbolAsyncIterator](), predicate)
  }
  if (typeof value.find == 'function') {
    return value.find(predicate)
  }
  if (value.constructor == Object) {
    return arrayFind(objectValues(value), predicate)
  }
  return undefined
}

module.exports = find
