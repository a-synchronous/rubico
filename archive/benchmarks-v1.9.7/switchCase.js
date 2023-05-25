const { switchCase } = require('..')
const { timeInLoop } = require('../x')

const isPromise = value => value != null && typeof value.then == 'function'

const possiblePromiseThen = (value, func) => (
  isPromise(value) ? value.then(func) : func(value))

/**
 * @name funcConditional
 *
 * @synopsis
 * funcConditional(
 *   funcs Array<args=>Promise|any>,
 * )(args ...any) -> Promise|any
 */
const funcConditional = funcs => function funcSwitching(...args) {
  const lastIndex = funcs.length - 1
  let funcsIndex = -2
  while ((funcsIndex += 2) < lastIndex) {
    const shouldReturnNext = funcs[funcsIndex].apply(null, args)
    if (isPromise(shouldReturnNext)) {
      return shouldReturnNext.then(res => res
        ? funcs[funcsIndex + 1].apply(null, args)
        : asyncFuncSwitch(funcs, args, funcsIndex))
    }
    if (shouldReturnNext) {
      return funcs[funcsIndex + 1].apply(null, args)
    }
  }
  return funcs[funcsIndex].apply(null, args)
}

const funcConditionalRegularCalls = funcs => function funcSwitching(...args) {
  const lastIndex = funcs.length - 1
  let funcsIndex = -2
  while ((funcsIndex += 2) < lastIndex) {
    const shouldReturnNext = funcs[funcsIndex](...args)
    if (isPromise(shouldReturnNext)) {
      return shouldReturnNext.then(res => res
        ? funcs[funcsIndex + 1](...args)
        : asyncFuncSwitch(funcs, args, funcsIndex))
    }
    if (shouldReturnNext) {
      return funcs[funcsIndex + 1](...args)
    }
  }
  return funcs[funcsIndex](...args)
}

const arraySwitchCase = (funcs, args, index) => {
  if (index === funcs.length - 1) return funcs[index](...args)
  return possiblePromiseThen(
    funcs[index](...args),
    ok => ok
      ? funcs[index + 1](...args)
      : arraySwitchCase(funcs, args, index + 2),
  )
}

const switchCase1 = funcConditional

const switchCase10 = funcConditionalRegularCalls

const switchCase2 = funcs => (...args) => arraySwitchCase(funcs, args, 0)

// argument resolver for curry2
const curry2ResolveArg0 = (
  baseFunc, arg1,
) => function arg0Resolver(arg0) {
  return baseFunc(arg0, arg1)
}

// argument resolver for curry2
const curry2ResolveArg1 = (
  baseFunc, arg0,
) => function arg1Resolver(arg1) {
  return baseFunc(arg0, arg1)
}

/**
 * @name curry2
 *
 * @synopsis
 * __ = Symbol('placeholder')
 *
 * curry2(
 *   baseFunc function,
 *   arg0 __|any,
 *   arg1 __|any,
 * ) -> function
 */
const curry2 = function (baseFunc, arg0, arg1) {
  return arg0 == __
    ? curry2ResolveArg0(baseFunc, arg1)
    : curry2ResolveArg1(baseFunc, arg0)
}

const thunkify1 = (func, arg0) => () => func(arg0)

const thunkify3 = (func, arg0, arg1, arg2) => () => func(arg0, arg1, arg2)

const asyncFuncSwitch = async function (funcs, args, funcsIndex) {
  const lastIndex = funcs.length - 1
  while ((funcsIndex += 2) < lastIndex) {
    if (await funcs[funcsIndex](...args)) {
      return funcs[funcsIndex + 1](...args)
    }
  }
  return funcs[funcsIndex](...args)
}

const __ = Symbol('placeholder')

const thunkConditional = (
  boolean, thunkA, thunkB,
) => boolean ? thunkA() : thunkB()

const switchCase3 = funcs => function funcSwitching(...args) {
  const lastIndex = funcs.length - 1
  let funcsIndex = -2

  while ((funcsIndex += 2) < lastIndex) {
    const shouldReturnNext = funcs[funcsIndex](...args)
    if (isPromise(shouldReturnNext)) {
      return shouldReturnNext.then(
        curry3(
          thunkConditional,
          __,
          thunkify1(
            curry2(funcApply, funcs[funcsIndex + 1], __),
            args),
          thunkify3(asyncFuncSwitch, funcs, args, funcsIndex)))
    }
    if (shouldReturnNext) {
      return funcs[funcsIndex + 1](...args)
    }
  }
  return funcs[funcsIndex](...args)
}


/**
 * @name switchCase
 *
 * @benchmark
 *
 * @NOTE Bo5 runs
 * fiveCases_switchCaseRubico1: 1e+6: 369.264ms
 * fiveCases_switchCaseRubico10: 1e+6: 314.024ms
 * fiveCases_switchCaseRubico2: 1e+6: 301.841ms
 * fiveCases_switchCaseRubico3: 1e+6: 271.723ms
 *
 * fiveMilCases_switchCaseRubico1: 5e+0: 326.556ms
 * fiveMilCases_switchCaseRubico10: 5e+0: 263.211ms
 * fiveMilCases_switchCaseRubico2: Error: Maximum call stack size exceeded
 * fiveMilCases_switchCaseRubico3: 5e+0: 262.337ms
 *
 * fiveThousandCases_switchCaseRubico1: 5e+2: 63.736ms
 * fiveThousandCases_switchCaseRubico10: 5e+2: 48.004ms
 * fiveThousandCases_switchCaseRubico2: 5e+2: 270.643ms
 * fiveThousandCases_switchCaseRubico3: 5e+2: 25.742ms
 */

{
  const isOdd = x => x % 2 === 1

  const odd = () => 'odd'

  const even = () => 'even'

  /**
   * @name createCases
   *
   * @synopsis
   * createCases(length number) -> cases Array<function, length>
   */
  const createCases = function (length) {
    if (!isOdd(length)) throw new RangeError('length must be odd')
    const output = [], lastIndex = length - 1
    let index = -1
    while (++index < lastIndex) {
      output[index] = isOdd(index) ? odd : isOdd
    }
    output[index] = even
    return output
  }

  const fiveCases = createCases(5)

  const fiveCases_vanilla = num => isOdd(num) ? odd() : isOdd(num) ? odd() : even()

  const fiveCases_vanillaArgs = (...args) => isOdd(...args) ? odd(...args) : isOdd(...args) ? odd(...args) : even(...args)

  const fiveCases_switchCaseRubico1 = switchCase1(fiveCases)

  const fiveCases_switchCaseRubico10 = switchCase10(fiveCases)

  const fiveCases_switchCaseRubico2 = switchCase2(fiveCases)

  const fiveCases_switchCaseRubico3 = switchCase3(fiveCases)

  const fiveMilCases = createCases(4_999_999)

  const fiveMilCases_switchCaseRubico = switchCase(fiveMilCases)

  const fiveMilCases_switchCaseRubico1 = switchCase1(fiveMilCases)

  const fiveMilCases_switchCaseRubico10 = switchCase10(fiveMilCases)

  const fiveMilCases_switchCaseRubico2 = switchCase2(fiveMilCases)

  const fiveMilCases_switchCaseRubico3 = switchCase3(fiveMilCases)

  const fiveThousandCases = createCases(4_999)

  const fiveThousandCases_switchCaseRubico = switchCase(fiveThousandCases)

  const fiveThousandCases_switchCaseRubico1 = switchCase1(fiveThousandCases)

  const fiveThousandCases_switchCaseRubico10 = switchCase10(fiveThousandCases)

  const fiveThousandCases_switchCaseRubico2 = switchCase2(fiveThousandCases)

  const fiveThousandCases_switchCaseRubico3 = switchCase3(fiveThousandCases)

  // timeInLoop('fiveCases_vanilla', 1e6, () => fiveCases_vanilla(2))

  // timeInLoop('fiveCases_vanillaArgs', 1e6, () => fiveCases_vanillaArgs(2))

  // timeInLoop('fiveCases_switchCaseRubico1', 1e6, () => fiveCases_switchCaseRubico1(2))

  // timeInLoop('fiveCases_switchCaseRubico10', 1e6, () => fiveCases_switchCaseRubico10(2))

  // timeInLoop('fiveCases_switchCaseRubico2', 1e6, () => fiveCases_switchCaseRubico2(2))

  // console.log(fiveCases_switchCaseRubico3(2))

  // timeInLoop('fiveCases_switchCaseRubico3', 1e6, () => fiveCases_switchCaseRubico3(2))

  // timeInLoop('fiveMilCases_switchCaseRubico1', 5, () => fiveMilCases_switchCaseRubico1(2))

  // timeInLoop('fiveMilCases_switchCaseRubico10', 5, () => fiveMilCases_switchCaseRubico10(2))

  // timeInLoop('fiveMilCases_switchCaseRubico2', 5, () => fiveMilCases_switchCaseRubico2(2))

  // timeInLoop('fiveMilCases_switchCaseRubico3', 5, () => fiveMilCases_switchCaseRubico3(2))

  // timeInLoop('fiveThousandCases_switchCaseRubico1', 500, () => fiveThousandCases_switchCaseRubico1(2))

  // timeInLoop('fiveThousandCases_switchCaseRubico10', 500, () => fiveThousandCases_switchCaseRubico10(2))

  // timeInLoop('fiveThousandCases_switchCaseRubico2', 500, () => fiveThousandCases_switchCaseRubico2(2))

  // timeInLoop('fiveThousandCases_switchCaseRubico3', 500, () => fiveThousandCases_switchCaseRubico3(2))
}
