const timeInLoop = require('../x/timeInLoop')
const rubico = require('rubico')
const _ = require('lodash')

/**
 * @name pickRace
 *
 * @benchmark
 * rubico.pick(['a', 'b', 'c'])(object): 1e+6: 165.468ms
 * _.pick(['a', 'b', 'c'])(object): 1e+6: 1.324s
 */

{
  const objectABCDE = { a: 1, b: 2, c: 3, d: 4, e: 5 }

  const keys = ['a', 'b', 'c']

  // console.log(rubico.pick(keys)(objectABCDE))
  // console.log(_.pick(objectABCDE, keys))

  // timeInLoop("rubico.pick(['a', 'b', 'c'])(object)", 1e6, () => rubico.pick(keys)(objectABCDE))

  // timeInLoop("_.pick(['a', 'b', 'c'])(object)", 1e6, () => _.pick(objectABCDE, keys))
}
