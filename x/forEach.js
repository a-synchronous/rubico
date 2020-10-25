const isArray = require('../_internal/isArray')
const isGeneratorFunction = require('../_internal/isGeneratorFunction')
const isAsyncGeneratorFunction = require('../_internal/isAsyncGeneratorFunction')
const arrayForEach = require('../_internal/arrayForEach')
const objectForEach = require('../_internal/objectForEach')
const iteratorForEach = require('../_internal/iteratorForEach')
const asyncIteratorForEach = require('../_internal/asyncIteratorForEach')
const generatorFunctionForEach = require('../_internal/generatorFunctionForEach')
const asyncGeneratorFunctionForEach = require('../_internal/asyncGeneratorFunctionForEach')
const reducerForEach = require('../_internal/reducerForEach')
const symbolIterator = require('../_internal/symbolIterator')
const symbolAsyncIterator = require('../_internal/symbolAsyncIterator')

/**
 * @name forEach
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Reducer<T> = (any, T)=>Promise|any
 *
 * var T any,
 *   callback T=>(),
 *   collection Iterable<T>|AsyncIterable<T>{ forEach: callback=>() }|Object<T>,
 *   args ...any,
 *   generatorFunction ...args=>Generator<T>,
 *   asyncGeneratorFunction ...args=>AsyncGenerator<T>,
 *   reducer Reducer<T>
 *
 * forEach(callback)(collection) -> Promise<>|()
 *
 * forEach(callback)(generatorFunction) -> ...args=>Promise<>|()
 *
 * forEach(callback)(asyncGeneratorFunction) -> ...args=>Promise<>
 *
 * forEach(callback)(reducer) -> Reducer<T>
 * ```
 *
 * @description
 * Execute a callback for each item of a collection, returning a Promise if any execution is asynchronous. Effectively `callback => map(tap)(callback)`. Also works in transducer position.
 *
 * ```javascript [playground]
 * import forEach from 'https://unpkg.com/rubico/dist/x/forEach.es.js'
 *
 * forEach(console.log)([1, 2, 3, 4, 5]) // 1 2 3 4 5
 * forEach(console.log)({ a: 1, b: 2, c: 3 }) // 1 2 3
 *
 * const add = (a, b) => a + b
 *
 * const logNumber = number => console.log('got number', number)
 *
 * const numbers = [1, 2, 3, 4, 5]
 * const result = numbers.reduce(forEach(logNumber)(add), 0)
 * // got number 1
 * // got number 2
 * // got number 3
 * // got number 4
 * // got number 5
 *
 * console.log('result', result) // result 10
 * ```
 */
const forEach = callback => function executingCallbackForEach(value) {
  if (isArray(value)) {
    return arrayForEach(value, callback)
  }
  if (typeof value == 'function') {
    if (isGeneratorFunction(value)) {
      return generatorFunctionForEach(value, callback)
    }
    if (isAsyncGeneratorFunction(value)) {
      return asyncGeneratorFunctionForEach(value, callback)
    }
    return reducerForEach(value, callback)
  }
  if (value == null) {
    return value
  }
  if (typeof value.forEach == 'function') {
    return value.forEach(callback)
  }
  if (typeof value[symbolIterator] == 'function') {
    return iteratorForEach(value[symbolIterator](), callback)
  }
  if (typeof value[symbolAsyncIterator] == 'function') {
    return asyncIteratorForEach(value[symbolAsyncIterator](), callback)
  }
  if (value.constructor == Object) {
    return objectForEach(value, callback)
  }
  return value
}

module.exports = forEach
