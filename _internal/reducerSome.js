const reducerAnySync = require('./reducerAnySync')
const curry2 = require('./curry2')
const __ = require('./placeholder')
const isPromise = require('./isPromise')

/**
 * @name reducerSome
 *
 * @synopsis
 * ```coffeescript [specscript]
 * reducerSome(
 *   predicate any=>boolean,
 * ) -> anyReducer (result boolean, element any)=>boolean
 * ```
 *
 * @related foldableAllReducer
 *
 * @TODO throw to break early?
 */
const reducerSome = predicate => function anyReducer(result, element) {
  return result === true ? result
    : isPromise(result) ? result.then(curry2(reducerAnySync(predicate), __, element))
    : result ? true : predicate(element)
}

module.exports = reducerSome
