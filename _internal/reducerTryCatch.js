const isPromise = require('./isPromise')
const __ = require('./placeholder')
const curry5 = require('./curry5')
const curry4 = require('./curry4')
const curry2 = require('./curry2')
const always = require('./always')

/**
 * @name _reducerTryCatchErrorHandler
 *
 * @synopsis
 * ```coffeescript [specscript]
 * _reducerTryCatchErrorHandler(
 *   reducer function,
 *   error Error,
 *   accum any,
 *   item any,
 * ) -> Promise|any
 * ```
 */
const _reducerTryCatchErrorHandler = function (
  catcher, reducer, error, accum, item,
) {
  const c = catcher(error, item)
  return isPromise(c) ? c.then(curry2(reducer, accum, __)) : reducer(accum, c)
}

/**
 * @name reducerTryCatch
 *
 * @synopsis
 * ```coffeescript [specscript]
 * type Reducer = (accum any, item any)=>(nextAccumulator Promise|any)
 *
 * reducerTryCatch(
 *   reducer function,
 *   catcher function,
 * ) -> errorHandlingReducer function
 * ```
 */
const reducerTryCatch = function (reducer, transducerTryer, catcher) {
  const finalReducer = transducerTryer(reducer)
  return function errorHandlingReducer(accum, item) {
    try {
      const ret = finalReducer(accum, item)
      return isPromise(ret) ? ret.catch(curry5(
        _reducerTryCatchErrorHandler, catcher, reducer, __, accum, item,
      )) : ret
    } catch (error) {
      return _reducerTryCatchErrorHandler(
        catcher, reducer, error, accum, item,
      )
    }
  }
}

module.exports = reducerTryCatch
