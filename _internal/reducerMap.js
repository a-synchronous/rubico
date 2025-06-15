const isPromise = require('./isPromise')
const __ = require('./placeholder')
const curry2 = require('./curry2')

/**
 * @name reducerMap
 *
 * @synopsis
 * ```coffeescript [specscript]
 * reducerMap<
 *   T any,
 *   reducer (any, T)=>Promise|any,
 *   mapper T=>Promise|any,
 * >(reducer, mapper) -> mappingReducer (any, any)=>Promise|any
 * ```
 *
 * @description
 * Apply a mapper to elements of a reducer's operation. `mapper` may be asynchronous
 *
 * Note: If the mapper is asynchronous, the implementation of reduce that consumes the mapping reducer must resolve promises
 */
const reducerMap = (
  reducer, mapper,
) => function mappingReducer(result, reducerElement) {
  const mappingReducerElement = mapper(reducerElement)
  return isPromise(mappingReducerElement)
    ? mappingReducerElement.then(curry2(reducer, result, __))
    : reducer(result, mappingReducerElement)
}

module.exports = reducerMap
