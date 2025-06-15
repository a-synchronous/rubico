const get = require('../get')
const __ = require('../_internal/placeholder')
const curry2 = require('../_internal/curry2')

/**
 * @name _maxBy
 *
 * @synopsis
 * ```coffeescript [specscript]
 * _maxBy(array Array, path string) -> maxElementByPath any
 * ```
 */
const _maxBy = function (array, path) {
  const length = array.length
  const getter = get(path)
  let index = 0
  let maxElement = array[index]
  while (++index < length) {
    const element = array[index]
    if (getter(element) > getter(maxElement)) {
      maxElement = element
    }
  }
  return maxElement
}

/**
 * @name maxBy
 *
 * @synopsis
 * ```coffeescript [specscript]
 * maxBy(array Array, path string) -> maxElementByPath any
 *
 * maxBy(path string)(array Array) -> maxElementByPath any
 * ```
 *
 * @description
 * Finds the element that is the max by a property denoted by path.
 *
 * ```javascript [playground]
 * import maxBy from 'https://unpkg.com/rubico/dist/x/maxBy.es.js'
 *
 * const array = [{ a: 1 }, { a: 2 }, { a: 3 }]
 *
 * const maxElement = maxBy(array, 'a')
 *
 * console.log(maxElement) // { a: 3 }
 * ```
 *
 * `maxBy` composes in a lazy way.
 *
 * ```javascript [playground]
 * import maxBy from 'https://unpkg.com/rubico/dist/x/maxBy.es.js'
 *
 * const numbers = [1, 2, 3]
 *
 * const maxElement = pipe(numbers, [
 *   map(number => number ** 2),
 *   map(number => ({ a: { b: { c: number } } })),
 *   maxBy('a.b.c')
 * ])
 *
 * console.log(maxElement) // { a: { b: { c: 9 } } }
 * ```
 */
const maxBy = function (...args) {
  if (args.length > 1) {
    return _maxBy(...args)
  }
  return curry2(_maxBy, __, args[0])
}

module.exports = maxBy
