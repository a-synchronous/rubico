const timeInLoop = require('../x/timeInLoop')
const rubico = require('..')
const _ = require('lodash')
const R = require('ramda')

const isOdd = number => number % 2 == 1

/**
 * @name anyRace
 *
 * @benchmark
 * _.some: 1e+6: 22.635ms
 * R.any: 1e+6: 374.329ms
 * rubico.any: 1e+6: 26.815ms
 *
 * @remarks
 * promise check
 */

{
  const evenNumbers = [2, 4, 6, 8, 10]

  // console.log(_.some(evenNumbers, isOdd))
  // console.log(R.any(isOdd)(evenNumbers))
  // console.log(rubico.any(isOdd)(evenNumbers))

  // timeInLoop('_.some', 1e6, () => _.some(evenNumbers, isOdd))

  // timeInLoop('R.any', 1e6, () => R.any(isOdd)(evenNumbers))

  // timeInLoop('rubico.any', 1e6, () => rubico.any(isOdd)(evenNumbers))
}
