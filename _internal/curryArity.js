const areAnyValuesPromises = require('./areAnyValuesPromises')
const promiseAll = require('./promiseAll')
const __ = require('./placeholder')
const curry4 = require('./curry4')
const curry3 = require('./curry3')
const funcApply2 = require('./funcApply2')

/**
 * @name _curryArity
 *
 * @synopsis
 * ```coffeescript [specscript]
 * __ = Symbol(placeholder)
 *
 * var arity number,
 *   func function,
 *   context object,
 *   args Array<__|any>,
 *   curried function
 *
 * _curryArity(context, arity, func, args) -> curried|any
 * ```
 */
const _curryArity = (arity, func, context, args) => function curried(...curriedArgs) {
  const argsLength = args.length,
    curriedArgsLength = curriedArgs.length,
    nextArgs = []
  let argsIndex = -1,
    curriedArgsIndex = -1,
    numCurriedPlaceholders = 0

  while (++argsIndex < argsLength) {
    const arg = args[argsIndex]
    if (arg == __ && (curriedArgsIndex += 1) < curriedArgsLength) {
      const curriedArg = curriedArgs[curriedArgsIndex]
      if (curriedArg == __) {
        numCurriedPlaceholders += 1
      }
      nextArgs.push(curriedArg)
    } else {
      nextArgs.push(arg)
    }

    if (nextArgs.length == arity) {
      if (areAnyValuesPromises(nextArgs)) {
        return numCurriedPlaceholders == 0
          ? promiseAll(nextArgs).then(curry3(funcApply2, func, context, __))
          : promiseAll(nextArgs).then(curry4(curryArity, arity, func, context, __))
      }
      return numCurriedPlaceholders == 0
        ? func.apply(context, nextArgs)
        : curryArity(arity, func, context, nextArgs)
    }
  }

  while (++curriedArgsIndex < curriedArgsLength) {
    const curriedArg = curriedArgs[curriedArgsIndex]
    if (curriedArg == __) {
      numCurriedPlaceholders += 1
    }
    nextArgs.push(curriedArg)

    if (nextArgs.length == arity) {
      if (areAnyValuesPromises(nextArgs)) {
        return numCurriedPlaceholders == 0
          ? promiseAll(nextArgs).then(curry3(funcApply2, func, context, __))
          : promiseAll(nextArgs).then(curry4(curryArity, arity, func, context, __))
      }
      return numCurriedPlaceholders == 0
        ? func.apply(context, nextArgs)
        : curryArity(arity, func, context, nextArgs)
    }
  }

  return areAnyValuesPromises(nextArgs)
    ? promiseAll(nextArgs).then(curry4(curryArity, arity, func, context, __))
    : curryArity(arity, func, context, nextArgs)
}

/**
 * @name curryArity
 *
 * @synopsis
 * ```coffeescript [specscript]
 * __ = Symbol(placeholder)
 *
 * var arity number,
 *   func function,
 *   context object,
 *   args Array<__|any>,
 *   curried function
 *
 * curryArity(arity, func, context, args) -> curried|any
 * ```
 *
 * @description
 * Create a curried version of a function with specified arity.
 */

const curryArity = function (arity, func, context, args) {
  const argsLength = args.length
  if (argsLength < arity) {
    return _curryArity(arity, func, context, args)
  }
  let argsIndex = -1
  while (++argsIndex < argsLength) {
    const arg = args[argsIndex]
    if (arg == __) {
      return _curryArity(arity, func, context, args)
    }
  }
  return func.apply(context, args)
}

module.exports = curryArity
