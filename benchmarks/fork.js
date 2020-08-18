const timeInLoop = require('../x/timeInLoop')
const { fork } = require('..')

const funcs = [
  number => number + 1,
  number => number + 2,
  number => number + 3,
]

/**
 * @name fork
 *
 * @benchmark
 * vanillaCreateArray: 1e+6: 7.903ms
 * vanillaMapFuncs: 1e+6: 64.936ms
 * arrayFork1: 1e+6: 125.719ms
 */

{
  const numToArr = num => [num + 1, num + 2, num + 3]

  const vanillaCreateArray = () => numToArr(2)

  const vanillaMapFuncs = () => funcs.map(func => func(2))

  const forkOfFuncs = fork(funcs)

  const arrayFork1 = () => forkOfFuncs(2)

  // const func = vanillaCreateArray
  // const func = vanillaMapFuncs
  // const func = arrayFork1

  timeInLoop(func.name, 1e6, func)
}
