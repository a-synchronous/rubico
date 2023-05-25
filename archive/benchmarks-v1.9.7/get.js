const timeInLoop = require('../x/timeInLoop')
const rubico = require('rubico')
const _ = require('lodash')
const _fp = require('lodash/fp')
const R = require('ramda')

/**
 * @name getRace
 *
 * @benchmark
 * rubico.get('a.b.c'): 1e+6: 76.35ms
 * _.get('a.b.c'): 1e+6: 223.564ms
 * rubico.get('a'): 1e+6: 31.995ms
 * _.get('a'): 1e+6: 49.2ms
 * R.prop('a'): 1e+6: 228.473ms
 * rubico.get('[0][0][0][0][0]'): 1e+6: 76.845ms
 * _.get('[0][0][0][0][0]'): 1e+6: 219.156ms
 */

{
  const nestedABC = { a: { b: { c: 1 } } }
  const nestedArray5 = [[[[['hey']]]]]

  // console.log(rubico.get('a.b.c')(nestedABC))
  // console.log(_.get(nestedABC, 'a.b.c'))
  // console.log(rubico.get('a')(nestedABC))
  // console.log(_.get(nestedABC, 'a'))
  // console.log(rubico.get('[0][0][0][0][0]')(nestedArray5))
  // console.log(_.get(nestedArray5, '[0][0][0][0][0]'))

  // timeInLoop('rubico.get(\'a.b.c\')', 1e6, () => rubico.get('a.b.c')(nestedABC))

  // timeInLoop('_.get(\'a.b.c\')', 1e6, () => _.get(nestedABC, 'a.b.c'))

  // timeInLoop('rubico.get(\'a\')', 1e6, () => rubico.get('a')(nestedABC))

  // timeInLoop('_.get(\'a\')', 1e6, () => _.get(nestedABC, 'a'))

  // timeInLoop('R.prop(\'a\')', 1e6, () => R.prop('a', nestedABC))

  // timeInLoop('rubico.get(\'[0][0][0][0][0]\')', 1e6, () => rubico.get('[0][0][0][0][0]')(nestedArray5))

  // timeInLoop('_.get(\'[0][0][0][0][0]\')', 1e6, () => _.get(nestedArray5, '[0][0][0][0][0]'))
}
