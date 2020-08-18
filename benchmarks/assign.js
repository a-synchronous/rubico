const timeInLoop = require('../x/timeInLoop')
const { assign } = require('..')

const funcs = {
  a: ({ number }) => number + 1,
  b: ({ number }) => number + 2,
  c: ({ number }) => number + 3,
}

/**
 * @name assign
 *
 * @benchmark
 * vanillaCreateObject: 1e+6: 8.078ms
 * forInFuncs: 1e+6: 187.387ms
 * assign1: 1e+6: 412.397ms
 */

{
  const createNumsObject = ({ number }) => ({
    number,
    a: number + 1,
    b: number + 2,
    c: number + 3,
  })

  const vanillaCreateObject = () => createNumsObject({ number: 2 })

  const forInFuncs = function () {
    const obj = { number: 2 }
    const output = { ...obj }
    for (const key in funcs) {
      output[key] = funcs[key](obj)
    }
    return output
  }

  const assignment = assign(funcs)

  const assign1 = () => assignment({ number: 2 })

  // const func = vanillaCreateObject
  // const func = forInFuncs
  const func = assign1

  console.log(func())

  timeInLoop(func.name, 1e6, func)
}
