const isPromise = require('./isPromise')
const __ = require('./placeholder')
const curry3 = require('./curry3')
const reducerAllSync = require('./reducerAllSync')

/**
 * @name reducerEvery
 *
 * @synopsis
 * ```coffeescript [specscript]
 * reducerEvery(
 *   predicate any=>boolean,
 * ) -> reducer(result boolean, element any)=>boolean
 * ```
 */
const reducerEvery = predicate => function allReducer(result, element) {
  return result === false ? false
    : isPromise(result) ? result.then(
      curry3(reducerAllSync, predicate, __, element))
    : result ? predicate(element) : false
}

module.exports = reducerEvery
