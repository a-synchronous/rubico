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

/**
 * @name switchCase
 *
 * @benchmark
 * fiveCases_vanilla: 1e+6: 8.11ms
 * fiveCases_vanillaArgs: 1e+6: 86.009ms
 * fiveCases_switchCaseRubico: 1e+6: 165.871ms
 * fiveCases_switchCaseRubico1: 1e+6: 181.878ms
 * fiveCases_switchCaseRubico10: 1e+6: 165.125ms
 * fiveCases_switchCaseRubico2: 1e+6: 179.485ms
 * fiveMilCases_switchCaseRubico: 5e+0: 260.951ms
 * fiveMilCases_switchCaseRubico1: 5e+0: 318.051ms
 * fiveMilCases_switchCaseRubico10: 5e+0: 270.871ms
 * fiveMilCases_switchCaseRubico2: RangeError: Maximum call stack size exceeded
 * fiveThousandCases_switchCaseRubico: 5e+0: 3.219ms
 * fiveThousandCases_switchCaseRubico1: 5e+0: 9.911ms
 * fiveThousandCases_switchCaseRubico10: 5e+0: 3.372ms
 * fiveThousandCases_switchCaseRubico2: 5e+0: 91.189ms
 *
 * @NOTE Bo5 runs
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

  const fiveCases_switchCaseRubico = switchCase(fiveCases)

  const fiveCases_switchCaseRubico1 = switchCase1(fiveCases)

  const fiveCases_switchCaseRubico10 = switchCase10(fiveCases)

  const fiveCases_switchCaseRubico2 = switchCase2(fiveCases)

  const fiveMilCases = createCases(4_999_999)

  const fiveMilCases_switchCaseRubico = switchCase(fiveMilCases)

  const fiveMilCases_switchCaseRubico1 = switchCase1(fiveMilCases)

  const fiveMilCases_switchCaseRubico10 = switchCase10(fiveMilCases)

  const fiveMilCases_switchCaseRubico2 = switchCase2(fiveMilCases)

  const fiveThousandCases = createCases(4_999)

  const fiveThousandCases_switchCaseRubico = switchCase(fiveThousandCases)

  const fiveThousandCases_switchCaseRubico1 = switchCase1(fiveThousandCases)

  const fiveThousandCases_switchCaseRubico10 = switchCase10(fiveThousandCases)

  const fiveThousandCases_switchCaseRubico2 = switchCase2(fiveThousandCases)

  // timeInLoop('fiveCases_vanilla', 1e6, () => fiveCases_vanilla(2))

  // timeInLoop('fiveCases_vanillaArgs', 1e6, () => fiveCases_vanillaArgs(2))

  // timeInLoop('fiveCases_switchCaseRubico', 1e6, () => fiveCases_switchCaseRubico(2))

  // timeInLoop('fiveCases_switchCaseRubico1', 1e6, () => fiveCases_switchCaseRubico1(2))

  // timeInLoop('fiveCases_switchCaseRubico10', 1e6, () => fiveCases_switchCaseRubico10(2))

  // timeInLoop('fiveCases_switchCaseRubico2', 1e6, () => fiveCases_switchCaseRubico2(2))

  // timeInLoop('fiveMilCases_switchCaseRubico', 5, () => fiveMilCases_switchCaseRubico(2))

  // timeInLoop('fiveMilCases_switchCaseRubico1', 5, () => fiveMilCases_switchCaseRubico1(2))

  // timeInLoop('fiveMilCases_switchCaseRubico10', 5, () => fiveMilCases_switchCaseRubico10(2))

  // timeInLoop('fiveMilCases_switchCaseRubico2', 1e6, () => fiveMilCases_switchCaseRubico2(2))

  timeInLoop('fiveThousandCases_switchCaseRubico', 5, () => fiveThousandCases_switchCaseRubico(2))

  // timeInLoop('fiveThousandCases_switchCaseRubico1', 5, () => fiveThousandCases_switchCaseRubico1(2))

  // timeInLoop('fiveThousandCases_switchCaseRubico10', 5, () => fiveThousandCases_switchCaseRubico10(2))

  // timeInLoop('fiveThousandCases_switchCaseRubico2', 5, () => fiveThousandCases_switchCaseRubico2(2))
}
