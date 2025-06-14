/**
 * rubico v2.7.0
 * https://github.com/a-synchronous/rubico
 * (c) 2019-2025 Richard Tong
 * rubico may be freely distributed under the MIT license.
 */
const __ = Symbol.for('placeholder')

const _curryArity = (arity, func, args) => function curried(...curriedArgs) {
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
        ? func(...nextArgs)
        : curryArity(arity, func, nextArgs)
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
        ? func(...nextArgs)
        : curryArity(arity, func, nextArgs)
    }
  }
  return curryArity(arity, func, nextArgs)
}

const curryArity = function (arity, func, args) {
  const argsLength = args.length
  if (argsLength < arity) {
    return _curryArity(arity, func, args)
  }
  let argsIndex = -1
  while (++argsIndex < argsLength) {
    const arg = args[argsIndex]
    if (arg == __) {
      return _curryArity(arity, func, args)
    }
  }
  return func(...args)
}

const curry = (func, ...args) => curryArity(func.length, func, args)

curry.arity = function curryArity_(arity, func, ...args) {
  return curryArity(arity, func, args)
}

export default curry
