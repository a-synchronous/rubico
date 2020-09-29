const isPromise = require('./isPromise')
const __ = require('./placeholder')
const curry3 = require('./curry3')
const reducerAllSync = require('./reducerAllSync')

/**
 * @name reducerAll
 *
 * @synopsis
 * ```coffeescript [specscript]
 * reducerAll(
 *   predicate any=>boolean,
 * ) -> reducer(result boolean, item any)=>boolean
 * ```
 */
const reducerAll = predicate => function allReducer(result, item) {
  return result === false ? false
    : isPromise(result) ? result.then(
      curry3(reducerAllSync, predicate, __, item))
    : result ? predicate(item) : false
}

module.exports = reducerAll
