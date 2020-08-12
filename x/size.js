'use strict'

const Instance = require('../monad/Instance')
const Struct = require('../monad/Struct')

const { isString } = Instance

const structSize = Struct.size

/**
 * @name size
 *
 * @synopsis
 * size(value String|Array|Object|Set|Map) -> number
 *
 * @catchphrase
 * Get the size of a collection
 *
 * @description
 * `size` accepts a String, Array, Object, Set, or Map and returns its current size in items as a number.
 *
 * @example
 * console.log(
 *   size([1, 2, 3]),
 * ) // 3
 */
const size = x => isString(x) ? x.length : structSize(x)

module.exports = size
