const isPromise = require('./isPromise')
const thunkConditional = require('./thunkConditional')
const thunkifyArgs = require('./thunkifyArgs')
const thunkify3 = require('./thunkify3')
const __ = require('./placeholder')
const curry3 = require('./curry3')

/**
 * @name funcsOrValuesConditional
 *
 * @synopsis
 * ```coffeescript [specscript]
 * funcsOrValuesConditional(
 *   funcsOrValues Array<function|value>,
 *   args Array,
 *   funcsIndex number,
 * ) -> Promise|any
 * ```
 *
 * @description
 * Conditional operator `a ? b : c ? d : e ? ...` for functions.
 *
 * @TODO isPromise conditional await
 * @TODO benchmark vs regular promise handling
 */
const funcsOrValuesConditional = function (funcsOrValues, args, funcsIndex) {
  const lastIndex = funcsOrValues.length - 1

  while ((funcsIndex += 2) < lastIndex) {
    const predicate = funcsOrValues[funcsIndex],
      resolverOrValue = funcsOrValues[funcsIndex + 1]

    const predication = typeof predicate == 'function'
      ? predicate(...args)
      : predicate

    if (isPromise(predication)) {
      return predication.then(curry3(
        thunkConditional,
        __,
        typeof resolverOrValue == 'function'
          ? thunkifyArgs(resolverOrValue, args)
          : always(resolverOrValue),
        thunkify3(funcsOrValuesConditional, funcsOrValues, args, funcsIndex),
      ))
    }

    if (predication) {
      return typeof resolverOrValue == 'function'
        ? resolverOrValue(...args)
        : resolverOrValue
    }
  }

  // even number of funcsOrValues
  if (funcsIndex == funcsOrValues.length) {
    return undefined
  }

  const defaultResolverOrValue = funcsOrValues[lastIndex]
  return typeof defaultResolverOrValue == 'function'
    ? defaultResolverOrValue(...args)
    : defaultResolverOrValue
}

module.exports = funcsOrValuesConditional
