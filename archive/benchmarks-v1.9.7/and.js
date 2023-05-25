const timeInLoop = require('../x/timeInLoop')
const rubico = require('..')

const { and } = rubico

const isOdd = x => x % 2 == 1

const threeOddChecks = number => isOdd(number) && isOdd(number) && isOdd(number)

const threeIsOdd = and([isOdd, isOdd, isOdd])

/**
 * @name or
 *
 * @benchmark
 * isOdd(value) && isOdd(value) && isOdd(value): 1e+6: 6.664ms
 * and([isOdd, isOdd, isOdd]): 1e+6: 16.842ms
 */

{
  // timeInLoop('isOdd(value) && isOdd(value) && isOdd(value)', 1e6, () => threeOddChecks(1))

  // timeInLoop('and([isOdd, isOdd, isOdd])', 1e6, () => threeIsOdd(1))
}
