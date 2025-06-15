const isPromise = require('./isPromise')
const __ = require('./placeholder')
const curry5 = require('./curry5')
const curry2 = require('./curry2')

/**
 * @name _reducerTryCatchErrorHandler
 *
 * @synopsis
 * ```coffeescript [specscript]
 * _reducerTryCatchErrorHandler(
 *   reducer function,
 *   error Error,
 *   accum any,
 *   element any,
 * ) -> Promise|any
 * ```
 */
const _reducerTryCatchErrorHandler = function (
  catcher, reducer, error, accum, element,
) {
  const c = catcher(error, element)
  return isPromise(c) ? c.then(curry2(reducer, accum, __)) : reducer(accum, c)
}

/**
 * @name reducerTryCatch
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Reducer = (accum any, element any)=>(nextAccumulator Promise|any)
 *
 * reducerTryCatch(
 *   reducer function,
 *   catcher function,
 * ) -> errorHandlingReducer function
 * ```
 */
const reducerTryCatch = function (reducer, transducerTryer, catcher) {
  const finalReducer = transducerTryer(reducer)
  return function errorHandlingReducer(accum, element) {
    try {
      const ret = finalReducer(accum, element)
      return isPromise(ret) ? ret.catch(curry5(
        _reducerTryCatchErrorHandler, catcher, reducer, __, accum, element,
      )) : ret
    } catch (error) {
      return _reducerTryCatchErrorHandler(
        catcher, reducer, error, accum, element,
      )
    }
  }
}

module.exports = reducerTryCatch
