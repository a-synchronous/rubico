const isPromise = require('./isPromise')
const __ = require('./placeholder')
const curry2 = require('./curry2')

/**
 * @name reducerConcat
 *
 * @synopsis
 * ```coffeescript [specscript]
 * reducerConcat<
 *   T any,
 *   intermediate any,
 *   reducerA (any, T)=>Promise|intermediate,
 *   reducerB (intermediate, T)=>Promise|any,
 * >(reducerA, reducerB) -> pipedReducer (any, T)=>Promise|any
 * ```
 */
const reducerConcat = (
  reducerA, reducerB,
) => function pipedReducer(result, item) {
  const intermediate = reducerA(result, item)
  return isPromise(intermediate)
    ? intermediate.then(curry2(reducerB, __, item))
    : reducerB(intermediate, item)
}

module.exports = reducerConcat
