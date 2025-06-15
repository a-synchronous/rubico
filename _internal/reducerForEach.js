const isPromise = require('./isPromise')
const thunkify2 = require('./thunkify2')

/**
 * @name reducerForEach
 *
 * @synopsis
 * ```coffeescript [specscript]
 * Reducer<T> = (any, T)=>Promise|any
 *
 * var T any,
 *   reducer Reducer<T>
 *
 * reducerForEach(reducer, callback) -> reducer
 * ```
 *
 * @description
 * Create a reducer that additionally executes a callback for each element of its reducing operation.
 */
const reducerForEach = (
  reducer, callback,
) => function executingForEach(result, element) {
  const operation = callback(element)
  if (isPromise(operation)) {
    return operation.then(thunkify2(reducer, result, element))
  }
  return reducer(result, element)
}

module.exports = reducerForEach
