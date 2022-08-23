const get = require('../get')
const __ = require('../_internal/placeholder')
const curry2 = require('../_internal/curry2')

/**
 * @name _maxBy
 *
 * @synopsis
 * ```coffeescript [specscript]
 * _maxBy(array Array, path string) -> maxItemByPath any
 * ```
 */
const _maxBy = function (array, path) {
  const length = array.length
  const getter = get(path)
  let index = 0
  let maxItem = array[index]
  while (++index < length) {
    const item = array[index]
    if (getter(item) > getter(maxItem)) {
      maxItem = item
    }
  }
  return maxItem
}

/**
 * @name maxBy
 *
 * @synopsis
 * ```coffeescript [specscript]
 * maxBy(array Array, path string) -> maxItemByPath any
 *
 * maxBy(path string)(array Array) -> maxItemByPath any
 * ```
 *
 * @description
 * Finds the item that is the max by a property denoted by path.
 *
 * ```javascript [playground]
 * import maxBy from 'https://unpkg.com/rubico/dist/x/maxBy.es.js'
 *
 * const array = [{ a: 1 }, { a: 2 }, { a: 3 }]
 *
 * const maxItem = maxBy(array, 'a')
 *
 * console.log(maxItem) // { a: 3 }
 * ```
 *
 * `maxBy` composes in a pointfree way.
 *
 * ```javascript [playground]
 * import maxBy from 'https://unpkg.com/rubico/dist/x/maxBy.es.js'
 *
 * const numbers = [1, 2, 3]
 *
 * const maxItem = pipe(numbers, [
 *   map(number => number ** 2),
 *   map(number => ({ a: { b: { c: number } } })),
 *   maxBy('a.b.c')
 * ])
 *
 * console.log(maxItem) // { a: { b: { c: 9 } } }
 * ```
 */
const maxBy = function (...args) {
  if (args.length > 1) {
    return _maxBy(...args)
  }
  return curry2(_maxBy, __, args[0])
}

module.exports = maxBy
