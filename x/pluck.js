const funcConcat = require('../_internal/funcConcat')
const map = require('../map')
const get = require('../get')

/**
 * @name pluck
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Functor<T> = Array<T>|Object<T>|Iterator<T>|AsyncIterator<T>|{ map: T=>any }
 * Reducer<T> = (any, T)=>Promise|any
 *
 * var T any,
 *   mapper T=>Promise|any,
 *   functor Functor<T>
 *   args ...any,
 *   generatorFunction ...args=>Generator<T>,
 *   asyncGeneratorFunction ...args=>AsyncGenerator<T>,
 *   reducer Reducer<T>
 *
 * pluck(functor) -> Promise|Functor
 *
 * pluck(generatorFunction) -> ...args=>Generator
 *
 * pluck(asyncGeneratorFunction) -> ...args=>AsyncGenerator
 *
 * pluck(reducer) -> Reducer
 * ```
 *
 * @description
 * Apply a getter denoted by path across all items of a collection, creating a new collection of plucked values. Also works in transducer position.
 *
 * ```javascript [playground]
 * import pluck from 'https://unpkg.com/rubico/dist/x/pluck.es.js'
 *
 * const users = [
 *   { name: 'George', age: 33 },
 *   { name: 'Jane', age: 51 },
 *   { name: 'Jim', age: 22 },
 * ]
 *
 * const usernames = pluck('name')(users)
 *
 * console.log(usernames) // ['George', 'Jane', 'Jim']
 *
 * const add = (a, b) => a + b
 *
 * console.log(
 *   'total age:',
 *   users.reduce(pluck('age')(add), 0),
 * ) // total age: 96
 * ```
 */
const pluck = funcConcat(get, map)

module.exports = pluck
