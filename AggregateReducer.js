const reducerConcat = require('./_internal/reducerConcat')
const identity = require('./_internal/identity')

/**
 * @name AggregateReducer
 *
 * @synopsis
 * ```coffeescript [specscript]
 * AggregateReducer(reducers Array<reducer function>) -> aggregateReducer function
 * ```
 */
const AggregateReducer = function (reducers) {
  if (reducers.length == 0) {
    return identity
  }
  return reducers.reduce(reducerConcat, identity)
}

module.exports = AggregateReducer
