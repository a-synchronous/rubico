const timeInLoop = require('../x/timeInLoop')
const { flatMap } = require('..')
const R = require('ramda')
const _ = require('lodash')
const _fp = require('lodash/fp')

/**
 * @name competitiveFlatMap
 *
 * @benchmark
 * flatMap(duplicate)(array): 1e+5: 69.215ms
 * R.chain(duplicate, array): 1e+5: 169.668ms
 * _fp.flatMap(duplicate, array): 1e+5: 85.848ms
 *
 * flatMap(identity)(array): 1e+5: 53.501ms
 * R.chain(identity, array): 1e+5: 160.813ms
 * _fp.flatMap(identity, array): 1e+5: 81.023ms
 */

{
  const numbersArray = [1, 2, 3, 4, 5]

  const duplicateArray = value => [value, value]

  const identity = value => value

  // console.log(flatMap(duplicateArray)(numbersArray))
  // console.log(flatMap(identity)(numbersArray))
  // console.log(R.chain(duplicateArray, numbersArray))
  // console.log(R.chain(identity, numbersArray))
  // console.log(_fp.flatMap(duplicateArray, numbersArray))
  // console.log(_fp.flatMap(identity, numbersArray))

  const flatMapDuplicateArray = flatMap(duplicateArray)

  // timeInLoop('flatMap(duplicate)(array)', 1e5, () => flatMap(duplicateArray)(numbersArray))

  // timeInLoop('R.chain(duplicate, array)', 1e5, () => R.chain(duplicateArray, numbersArray))

  // timeInLoop('_fp.flatMap(duplicate, array)', 1e5, () => _fp.flatMap(duplicateArray, numbersArray))

  // timeInLoop('flatMap(identity)(array)', 1e5, () => flatMap(identity)(numbersArray))

  // timeInLoop('R.chain(identity, array)', 1e5, () => R.chain(identity, numbersArray))

  // timeInLoop('_fp.flatMap(identity, array)', 1e5, () => _fp.flatMap(identity, numbersArray))
}

