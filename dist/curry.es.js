/**
 * rubico v2.8.0
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2026 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */
const __ = Symbol.for('placeholder')

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
      return numCurriedPlaceholders == 0
        ? func.apply(context, nextArgs)
        : curryArity(arity, func, context, nextArgs)
    }
  }
  return curryArity(arity, func, context, nextArgs)
}

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

const curry = (func, ...args) => curryArity(func.length, func, this, args)

curry.arity = function curryArity_(arity, func, ...args) {
  return curryArity(arity, func, this, args)
}

curry.call = function call(func, context, ...args) {
  return curryArity(func.length, func, context, args)
}

export default curry
