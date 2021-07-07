const isObject = require('./_internal/isObject')
const isString = require('./x/isString')
const getByPath = require('./_internal/getByPath')

/**
 * @name set
 *
 * @synopsis
 * ```coffeescript [specscript]
 * var value any,
 *   path string|Array<string|number>,
 *   value (value=>any)|any
 *
 * set(path, value) -> setter  object=>object
 * ```
 *
 * @description
 * Create a setter that sets a property on an object denoted by path.
 *
 * ```javascript [playground]
 * console.log(
 *   set('a.b', '1')({ a: { c : 2 }),
 * ) // { a : { b: 1, c: 2 }}
  * console.log(
 *   set('a[0].b.c', 4)({ 'a': [{ 'b': { 'c': 3 } }] }),
 * ) // { 'a': [{ 'b': { 'c': 4 } }] }
*   console.log(set(['a', 'b'], '1')({ a: { c : 2 })),
 * ) // { a: { b: 1, c: 2 }}
 * ```
 */

const toPathArray = path => {
  if(isString(path)) return path.split(".")
  if(Array.isArray(path)) return path
  throw Error(`path should be a string or an array`)
}

const set = (path, value) => function setter(obj) {
  if( !isObject(obj) ){
    return obj
  }
  let index = -1
  const pathArray = toPathArray(path)
  const pathLength = pathArray.length

  const result = { ...obj }
  let nested = result
  while( nested != null && ++index < pathLength ){
    const pathKey = pathArray[index]
    if(index == (pathLength - 1)){
      nested[pathKey] = value
    } else {
      const value = getByPath(nested, pathKey)
      if(!value) {
        nested[pathKey] = {}
        nested = nested[pathKey]
      } else {
        nested = value
      }
    }
  } 

  return result
}

module.exports = set
