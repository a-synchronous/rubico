const timeInLoop = require('../x/timeInLoop')
const { reduce } = require('..')
const R = require('ramda')
const _ = require('lodash')
const _fp = require('lodash/fp')

/**
 * @name raceAddNumbers
 *
 * @benchmark
 * rubico.reduce(add, 0)(numbers): 1e+6: 21.505ms
 * ramda.reduce(add, 0)(numbers): 1e+6: 400.881ms
 * lodash.fp.reduce(add, 0)(numbers): 1e+6: 256.675ms
 * lodash.reduce(numbers, add, 0): 1e+6: 26.885ms
 * lodash.reduce(numbers, add, 0) handicap: 1e+6: 26.512ms
 *
 * @note Bo5
 */

{
  const numbers = [1, 2, 3, 4, 5]

  const add = (a, b) => a + b

  const rubicoReducing = reduce(add, 0)

  const ramdaReducing = R.reduce(add, 0)

  const _reduce = _.reduce

  const lodashFPReducing = _fp.reduce(add, 0)

  const lodashReducing = numbers => _reduce(numbers, add, 0)

  const lodashBoostedReducing = () => _reduce(numbers, add, 0)

  // console.log(rubicoReducing(numbers))
  // console.log(ramdaReducing(numbers))
  // console.log(lodashFPReducing(numbers))
  // console.log(lodashReducing(numbers))
  // console.log(lodashBoostedReducing(numbers))

  // timeInLoop('rubico.reduce(add, 0)(numbers)', 1e6, () => rubicoReducing(numbers))

  // timeInLoop('ramda.reduce(add, 0)(numbers)', 1e6, () => ramdaReducing(numbers))

  // timeInLoop('lodash.fp.reduce(add, 0)(numbers)', 1e6, () => lodashFPReducing(numbers))

  // timeInLoop('lodash.reduce(numbers, add, 0)', 1e6, () => lodashReducing(numbers))

  timeInLoop('lodash.reduce(numbers, add, 0) handicap', 1e6, () => lodashBoostedReducing(numbers))

}

/**
 * @name arrayReduce
 */
