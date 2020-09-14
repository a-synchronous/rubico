const timeInLoop = require('../x/timeInLoop')
const { flatMap } = require('..')
const R = require('ramda')
const _ = require('lodash')
const _fp = require('lodash/fp')

/**
 * @name arrayFlatMap
 *
 * @benchmark
 * flatMap(duplicate)(array): 1e+5: 69.215ms
 * R.chain(duplicate, array): 1e+5: 169.668ms
 *
 * flatMap(identity)(array): 1e+5: 53.501ms
 * R.chain(identity, array): 1e+5: 160.813ms
 */

{
  const numbersArray = [1, 2, 3, 4, 5]

  const duplicateArray = value => [value, value]

  const identity = value => value

  // console.log(flatMap(duplicateArray)(numbersArray))
  // console.log(flatMap(identity)(numbersArray))
  console.log(R.chain(identity, numbersArray))

  const flatMapDuplicateArray = flatMap(duplicateArray)

  // timeInLoop('flatMap(duplicate)(array)', 1e5, () => flatMap(duplicateArray)(numbersArray))

  // timeInLoop('R.chain(duplicate, array)', 1e5, () => R.chain(duplicateArray, numbersArray))

  // timeInLoop('flatMap(identity)(array)', 1e5, () => flatMap(identity)(numbersArray))

  // timeInLoop('R.chain(identity, array)', 1e5, () => R.chain(identity, numbersArray))
}

