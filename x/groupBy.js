const EmptyMap = require('../_internal/EmptyMap')
const isPromise = require('../_internal/isPromise')
const reduce = require('../reduce')
const __ = require('../_internal/placeholder')
const curry3 = require('../_internal/curry3')

// (mapOfArrays Map<any=>Array>, key any, element any) => mapOfArrays
// TODO: benchmark vs mapOfArrays.has(key)
const group = function (mapOfArrays, key, element) {
  const array = mapOfArrays.get(key)
  if (array == null) {
    mapOfArrays.set(key, [element])
  } else {
    array.push(element)
  }
  return mapOfArrays
}

// property string => (mapOfArrays Map<any=>Array>, element any) => mapOfArrays
const groupByProperty = property => function groupByPropertyReducer(
  mapOfArrays, element,
) {
  return group(mapOfArrays, element[property], element)
}

// resolver any=>any => (mapOfArrays Map<any=>Array>, element any) => mapOfArrays
const groupByResolver = resolver => function groupByResolverReducer(
  mapOfArrays, element,
) {
  const key = resolver(element)
  return isPromise(key)
    ? key.then(curry3(group, mapOfArrays, __, element))
    : group(mapOfArrays, key, element)
}


/**
 * @name groupBy
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Reducer<T> = (any, T)=>Promise|any
 * Foldable<T> = Iterable<T>|AsyncIterable<T>|{ reduce: Reducer<T>=>any }|Object<T>
 *
 * var property any,
 *   resolver any=>Promise|any,
 *   value Foldable
 *
 * groupBy(property)(value) -> groupedByProperty Map<any=>Array>
 *
 * groupBy(resolver)(value) -> groupedByResolver Promise|Map<any=>Array>
 * ```
 *
 * @description
 * Group a foldable collection into a Map of arrays by a property on each of its elements.
 *
 * ```javascript [playground]
 * import groupBy from 'https://unpkg.com/rubico/dist/x/groupBy.es.js'
 *
 * console.log(
 *   groupBy('age')([
 *     { name: 'John', age: 22 },
 *     { name: 'Jane', age: 22 },
 *     { name: 'Henry', age: 23 },
 *   ]),
 * )
 * // Map {
 * //   22 => [{ name: 'John', age: 22 }, { name: 'Jane', age: 22 }],
 * //   23 => [{ name: 'Henry', age: 23 }],
 * // }
 * ```
 *
 * Additionally, pass a resolver in property position to resolve a value for group membership for each element.
 *
 * ```javascript [playground]
 * import groupBy from 'https://unpkg.com/rubico/dist/x/groupBy.es.js'
 *
 * console.log(
 *   groupBy(
 *     word => word.toLowerCase(),
 *   )(['Hello', 'hello', 'Hey']),
 * ) // Map { 'hello' => ['Hello', 'hello'], 'hey' => ['Hey'] }
 * ```
 */
const groupBy = propertyOrResolver => typeof propertyOrResolver == 'function'
  ? reduce(groupByResolver(propertyOrResolver), EmptyMap)
  : reduce(groupByProperty(propertyOrResolver), EmptyMap)

module.exports = groupBy
