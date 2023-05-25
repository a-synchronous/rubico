const timeInLoop = require('../x/timeInLoop')
const rubico = require('..')
const _ = require('lodash')
const R = require('ramda')

const isOdd = number => number % 2 == 1

const isEven = number => number % 2 == 0

/**
 * @name allRace
 *
 * @benchmark
 * _.every: 1e+6: 20.984ms
 * R.all: 1e+6: 368.142ms
 * rubico.all: 1e+6: 24.772ms
 *
 * @remarks
 * promise check
 */

{
  const evenNumbers = [2, 4, 6, 8, 10]

  // console.log(_.every(evenNumbers, isEven))
  // console.log(R.all(isEven)(evenNumbers))
  // console.log(rubico.all(isEven)(evenNumbers))

  // timeInLoop('_.every', 1e6, () => _.every(evenNumbers, isEven))

  // timeInLoop('R.all', 1e6, () => R.all(isEven)(evenNumbers))

  // timeInLoop('rubico.all', 1e6, () => rubico.all(isEven)(evenNumbers))
}
