const curry3 = require('./curry3')
const __ = require('./placeholder')
const thunkify2 = require('./thunkify2')
const thunkConditional = require('./thunkConditional')
const isPromise = require('./isPromise')
const always = require('./always')

/**
 * @name reducerFilter
 *
 * @synopsis
 * ```coffeescript [specscript]
 * reducerFilter<
 *   T any,
 *   reducer (any, T)=>Promise|any,
 *   predicate T=>Promise|boolean,
 * >(reducer, predicate) -> filteringReducer (any, any)=>Promise|any
 * ```
 *
 * @description
 * Filter elements from a reducer's operation by predicate. `predicate` may be asynchronous.
 *
 * Note: If the predicate is asynchronous, the implementation of reduce that consumes the filtering reducer must resolve promises
 */
const reducerFilter = (
  reducer, predicate,
) => function filteringReducer(result, element) {
  const shouldInclude = predicate(element)
  return isPromise(shouldInclude)
    ? shouldInclude.then(curry3(
      thunkConditional,
      __,
      thunkify2(reducer, result, element),
      always(result)))
    : shouldInclude ? reducer(result, element) : result
}

module.exports = reducerFilter
