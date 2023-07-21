const timeInLoop = require('../x/timeInLoop')
const rubico = require('rubico')
const _ = require('lodash')

/**
 * @name omitRace
 *
 * @benchmark
 * rubico.omit(['a', 'b', 'c'])(object): 1e+6: 599.19ms
 * _.omit(['a', 'b', 'c'])(object): 1e+6: 2.651s
 *
 * 2020-11-30
 * rubico.omit(['a', 'b', 'c'])(object): 1e+6: 628.47ms
 * _.omit(['a', 'b', 'c'])(object): 1e+6: 2.595s
 */

{
  const objectABCDE = { a: 1, b: 2, c: 3, d: 4, e: 5 }

  const keys = ['a', 'b', 'c']

  // console.log(rubico.omit(keys)(objectABCDE))
  // console.log(_.omit(objectABCDE, keys))

  // timeInLoop("rubico.omit(['a', 'b', 'c'])(object)", 1e6, () => rubico.omit(keys)(objectABCDE))

  // timeInLoop("_.omit(['a', 'b', 'c'])(object)", 1e6, () => _.omit(objectABCDE, keys))
}
