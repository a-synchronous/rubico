const isPromise = require('./isPromise')
const thunkConditional = require('./thunkConditional')
const thunkifyArgs = require('./thunkifyArgs')
const thunkify3 = require('./thunkify3')
const __ = require('./placeholder')
const curry3 = require('./curry3')

/**
 * @name funcConditional
 *
 * @synopsis
 * ```coffeescript [specscript]
 * funcConditional(
 *   funcs Array<args=>Promise|any>,
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
const funcConditional = function (funcs, args, funcsIndex) {
  const lastIndex = funcs.length - 1
  while ((funcsIndex += 2) < lastIndex) {
    const predicate = funcs[funcsIndex],
      resolver = funcs[funcsIndex + 1],
      predication = predicate(...args)

    if (isPromise(predication)) {
      return predication.then(curry3(
        thunkConditional,
        __,
        thunkifyArgs(resolver, args),
        thunkify3(funcConditional, funcs, args, funcsIndex)))
    }
    if (predication) {
      return resolver(...args)
    }
  }
  return funcs[funcsIndex](...args)
}

module.exports = funcConditional
